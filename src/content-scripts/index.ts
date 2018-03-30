import { Message } from '../common/types'
import voidAsyncWrapper from '../common/async-wrapper'

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

interface GptPayload {
    // TODO: Be defensive
    correlator: string
    iu_parts: string
    prev_iu_szs: string
    prev_scp: string
    cust_params: string
}

function parseGptPayload(payload: GptPayload) {
    const slotSizes = payload.prev_iu_szs.split(',')
    const slotTargeting = payload.prev_scp.split('|')
    const slotCount = slotTargeting.length
    const slots = []
    for (let i = 0; i < slotCount; i++) {
        const size = slotSizes[i]
        const targeting = parseTargetingString(slotTargeting[i])
        slots.push({
            correlator: payload.correlator,
            size,
            targeting
        })
    }

    return slots
}

function parseTargetingString(targeting: string) {
    const keyValues = targeting.split('&')
    const map: { [key: string]: string } = {}
    for (const kv of keyValues) {
        const [key, value = ''] = kv.split('=')
        map[key] = value
    }
    return map
}
