chrome.runtime.onInstalled.addListener(() => {
  console.log("Link Saver extension installed");
});

chrome.runtime.onStartup.addListener(() => {
  console.log("Link Saver extension started");
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(
      `Storage key "${key}" in namespace "${namespace}" changed.`,
      `Old value was "${oldValue}", new value is "${newValue}".`
    );
  }
});

const handleGetUserEmail = async (sendResponse: (response: any) => void) => {
  let syncStorage = await chrome.storage.sync.get(null);
  sendResponse({
    type: "userEmail",
    message: Object.keys(syncStorage).includes("email")
      ? syncStorage["email"]
      : null,
  });
}

const handleCheckLogin = async (sendResponse: (response: any) => void) => {
  let syncStorage = await chrome.storage.sync.get(null);
  sendResponse({
    type: "isLogin",
    message: String(Object.keys(syncStorage).includes("email")),
  });
}

chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
  console.log("background message received: ", data);
  switch (data.type) {
    case "log":
      console.log(data.message);
      break;

    case "isLogin":
      handleCheckLogin(sendResponse);
      break;

    case "userEmail":
      handleGetUserEmail(sendResponse)
      break;

    default:
      break;
  }
  return true;
});
