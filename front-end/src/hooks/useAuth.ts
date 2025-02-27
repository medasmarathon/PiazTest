import { extensionRequest } from "@/utils";
import { useState, useEffect } from "react";

export default function useAuth() {
  const [isLogin, setIsLogin] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    extensionRequest("userEmail").then(userEmail => {
      console.log("check current user email", userEmail);
      if (userEmail) {
        console.log("has email");
        setIsLogin(true);
        setUserEmail(userEmail);
      }
    })
  }, [isLogin])

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
          setUserEmail(data["email"]);
          await chrome.storage.sync.set({ ...data });
        })
        .catch(e => console.log((e as Error).message))
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
