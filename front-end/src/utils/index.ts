export async function extensionRequest(type: string, message?: string) {
  return await chrome.runtime.sendMessage({ type, message })
}