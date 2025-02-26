chrome.runtime.onInstalled.addListener(() => {
  console.log('Link Saver extension installed');
});

chrome.runtime.onStartup.addListener(() => {
  console.log('Link Saver extension started');
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(
      `Storage key "${key}" in namespace "${namespace}" changed.`,
      `Old value was "${oldValue}", new value is "${newValue}".`
    );
  }
});

chrome.runtime.onMessage.addListener(console.log);