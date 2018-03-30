export interface GptPayload {
    // TODO: Be defensive
    correlator: string
    iu_parts: string
    prev_iu_szs: string
    prev_scp: string
    cust_params: string
}

export function parseGptPayload(payload: GptPayload) {
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

export function parseTargetingString(targeting: string) {
    const keyValues = targeting.split('&')
    const map: { [key: string]: string } = {}
    for (const kv of keyValues) {
        const [key, value = ''] = kv.split('=')
        map[key] = value
    }
    return map
}
