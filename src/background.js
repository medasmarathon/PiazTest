chrome.runtime.onInstalled.addListener(() => {
  console.log('Link Saver extension installed');
});

chrome.runtime.onStartup.addListener(() => {
  console.log('Link Saver extension started');
});