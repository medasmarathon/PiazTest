import { useState, useEffect } from "react";

export default function useAuth() {
  const [isLogin, setIsLogin] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    chrome.runtime.sendMessage({ type: "userEmail" }, (response) => {
      if (response['message']) {
        setIsLogin(true);
        setUserEmail(response['message']);
      }
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
          setUserEmail(data["email"]);
          await chrome.storage.sync.set({ ...data });
        })
        .catch(e => console.warn((e as Error).message))
        .finally(() => setInProgress(false));
    });
  }

  const signOut = () => {
    chrome.storage.sync.clear();
  }

  return {
    isLogin,
    inProgress,
    userEmail,
    googleSignIn,
    signOut
  }
}
