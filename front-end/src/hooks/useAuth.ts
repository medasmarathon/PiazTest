import { useState, useEffect } from "react";

export default function useAuth() {
  const [isLogin, setIsLogin] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    chrome.storage.sync.get(null).then(user => {
      if (Object.keys(user).includes("email")) {
        extensionLogging("has email");
        setIsLogin(true);
        setUserEmail(user["email"]);
      }
      extensionLogging(userEmail);
    })
  }, [])


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
