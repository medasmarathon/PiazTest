async function extensionLogging(message: string) {
  return chrome.runtime.sendMessage(chrome.runtime.id, message)
}
