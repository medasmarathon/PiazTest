export async function extensionLogging(...messages: any[]) {
  return await chrome.runtime.sendMessage({ type: "log", message: messages.map(m => String(m)).join(", ") })
}

export async function extensionRequest(type: string, message?: string) {
  return await chrome.runtime.sendMessage({ type, message })
}