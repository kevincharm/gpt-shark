import { BaseMessage, GptMessage } from '../common/types'

startListening()

function startListening() {
    console.log('[gpt-shark] Started webRequest listener.')

    browser.webRequest.onBeforeRequest.addListener(webRequestListener, {
        urls: ['*://securepubads.g.doubleclick.net/*ads?*']
    })
}

async function webRequestListener(requestDetails: any) {
    const url = new URL(requestDetails.url)

    // searchParams is a Set. Creating an array from a Set returns Array<[key, value]>
    const paramArr = Array.from(url.searchParams as any) as Array<[string, string]>
    const params: { [key: string]: string } = {}
    for (const paramTuple of paramArr) {
        const [key, value] = paramTuple
        params[key] = value
    }

    const gptMessage: GptMessage = { kind: 'gpt-ad-call', payload: params }

    console.log('[gpt-shark] sending message', gptMessage)
    await sendMessage(gptMessage)

    return {}
}

async function sendMessage(message: BaseMessage) {
    try {
        const tabs = await browser.tabs.query({ active: true, currentWindow: true })
        await browser.tabs.sendMessage(tabs[0].id!, message)
    } catch (err) {
        console.error('[gpt-shark]', err)
    }
}
