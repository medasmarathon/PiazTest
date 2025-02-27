import { extensionLogging, extensionRequest } from "@/utils";
import { useState, useEffect } from "react";

export default function useAuth() {
  const [isLogin, setIsLogin] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    extensionRequest("userEmail").then(userEmail => {
      extensionLogging("check current user email", userEmail);
      if (userEmail) {
        extensionLogging("has email");
        setIsLogin(true);
        setUserEmail(userEmail);
      }
    })
  }, [])

  chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      if (key === "email" && typeof newValue === "string" && newValue.length > 0) {
        setIsLogin(true);
        setUserEmail(newValue);
        extensionLogging("Logging detected, new user email: " + newValue);
      }
    }
  });

  const googleSignIn = () => {
    setInProgress(true);
    chrome.identity.getAuthToken({ interactive: true }, function (token?: string | undefined, grantedScopes?: string[] | undefined) {
      fetch('https://www.googleapis.com/oauth2/v1/userinfo', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
        .then(async (response) => {
          let data = await response.json();
          setIsLogin(true);
          await chrome.storage.sync.set({ ...data });
        })
        .catch(e => extensionLogging((e as Error).message))
        .finally(() => setInProgress(false));
    });
  }

  return {
    isLogin,
    inProgress,
    userEmail,
    googleSignIn
  }
}
