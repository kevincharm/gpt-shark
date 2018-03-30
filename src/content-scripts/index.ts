import { Message } from '../common/types'
import voidAsyncWrapper from '../common/async-wrapper'
import { parseGptPayload } from './gpt'

start()

function start() {
    console.log('[gpt-shark] Loaded content script.')
    browser.runtime.onMessage.addListener(voidAsyncWrapper(messageListener))
}

async function messageListener(message: Message) {
    console.log('[gpt-shark] received message:', message)
    if (message.kind === 'gpt-ad-call') {
        console.log('[gpt-shark]', message.payload)
        console.log('[gpt-shark]', parseGptPayload(message.payload))
    }
}

export {}
