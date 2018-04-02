export interface GptPayload {
    // TODO: Be defensive
    [key: string]: string
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
    try {
        const keys = getAdKeys(payload)
        const slotSizes = getSlotSizes(payload)
        const slotTargeting = getSlotTargeting(payload)
        const slotCount = slotTargeting.length
        const slots: GptSlot[] = []
        for (let i = 0; i < slotCount; i++) {
            const sizes = parseSizeString(slotSizes[i])
            const targeting = parseTargetingString(slotTargeting[i])
            const adUnitPath = getAdUnitParts(payload)
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
    } catch (err) {
        console.error(payload, err)
        return {
            correlator: '',
            slots: []
        }
    }
}

/**
 * Some logic to find the ad key.
 * => "adk": "8597836759"
 * TODO: Be smarter, Use pattern matching.
 */
function getAdKeys(payload: GptPayload) {
    const adKeys = payload.adks || payload.adk
    if (!adKeys) {
        throw new Error(`Failed to retrieve ad key: ${adKeys}`)
    }
    return adKeys.split(',')
}

/**
 * Some logic to find the slot size.
 * => "sz": "300x250|300x300"
 * TODO: Be smarter, Use pattern matching.
 */
function getSlotSizes(payload: GptPayload) {
    const sizes = payload.prev_iu_szs || payload.sz
    if (!sizes) {
        throw new Error(`Failed to retrieve ad key: ${sizes}`)
    }
    return sizes.split(',')
}

/**
 * Some logic to find the ad key.
 * => scp: "keywords=gaming,australia&adblock=off&listing=listing"
 * TODO: Be smarter, Use pattern matching.
 */
function getSlotTargeting(payload: GptPayload) {
    const scp = payload.prev_scp || payload.scp
    if (!scp) {
        throw new Error(`Failed to retrieve ad key: ${scp}`)
    }
    return scp.split('|')
}

function getAdUnitParts(payload: GptPayload) {
    const iu = payload.iu_parts || payload.iu
    if (!iu) {
        throw new Error(`Failed to retrieve ad key: ${iu}`)
    }
    return '/' + iu.split(',').join('/')
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
