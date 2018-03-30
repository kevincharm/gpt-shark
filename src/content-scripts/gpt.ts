export interface GptPayload {
    // TODO: Be defensive
    adks: string
    correlator: string
    iu_parts: string
    prev_iu_szs: string
    prev_scp: string
    cust_params: string
}

export interface GptRequest {
    correlator: string
    slots: GptSlot[]
}

export interface GptSlot {
    correlator: string
    key: string
    adUnitPath: string
    sizes: string[]
    targeting: {
        [key: string]: string
    }
}

export function parseGptPayload(payload: GptPayload) {
    const keys = payload.adks.split(',')
    const slotSizes = payload.prev_iu_szs.split(',')
    const slotTargeting = payload.prev_scp.split('|')
    const slotCount = slotTargeting.length
    const slots: GptSlot[] = []
    for (let i = 0; i < slotCount; i++) {
        const sizes = parseSizeString(slotSizes[i])
        const targeting = parseTargetingString(slotTargeting[i])
        const adUnitPath = '/' + payload.iu_parts.split(',').join('/')
        slots.push({
            correlator: payload.correlator,
            key: keys[i],
            adUnitPath,
            sizes,
            targeting
        })
    }

    const request: GptRequest = {
        correlator: payload.correlator,
        slots
    }
    return request
}

function parseSizeString(rawSizes: string) {
    const sizes = rawSizes.split('|')
    return sizes
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
