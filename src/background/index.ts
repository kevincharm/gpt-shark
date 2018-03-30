startListening()

function startListening() {
    console.log('[gpt-shark] background: startListening')
    browser.webRequest.onBeforeRequest.removeListener(webRequestListener)
    browser.webRequest.onBeforeRequest.addListener(webRequestListener, {
        urls: ['*://securepubads.g.doubleclick.net/*ads?*']
    })
}

function webRequestListener(requestDetails: any) {
    console.log(`[gpt-shark] Intercepting: ${requestDetails.url}`)
    sendMessage(`[gpt-shark] Intercepting: ${requestDetails.url}`)
        .then()
        .catch()
}

async function sendMessage(message: string) {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true })
    await browser.tabs.sendMessage(tabs[0].id!, { message })
}
