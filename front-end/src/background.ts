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

chrome.runtime.onMessage.addListener(async (data, sender, sendResponse) => {
  console.log("background message received: ", data);
  let syncStorage;
  switch (data.type) {
    case "log":
      console.log(data.message);
      break;

    case "isLogin":
      syncStorage = await chrome.storage.sync.get(null);
      console.log(syncStorage);
      sendResponse({
        type: data.type,
        message: String(Object.keys(syncStorage).includes("email")),
      });
      break;

    case "userEmail":
      syncStorage = await chrome.storage.sync.get(null);
      console.log(syncStorage);
      sendResponse({
        type: data.type,
        message: Object.keys(syncStorage).includes("email")
          ? syncStorage["email"]
          : null,
      });
      break;

    default:
      break;
  }
  return true;
});
