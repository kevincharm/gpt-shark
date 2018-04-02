export type Message = GptMessage | UpdateAdsMapMessage

export interface GptMessage {
    kind: 'gpt-ad-call'
    payload: any
}

export interface UpdateAdsMapMessage {
    kind: 'update-ads-map'
}

/**
 * The interface describing the JSON object injected into the
 * #gpt-shark-ads-map script element.
 */
export interface GptSharkAdsMap {
    /**
     * This key is an unique identifier for an ad slot, but it sometimes undefined by GPT.
     */
    key?: string
    /**
     * This is identical to the outgoing GPT request URL so we can sorta use it as an
     * identifier for mapping an ad to an iframe.
     */
    contentUrl: string
    /**
     * This is actually only part of the frame's element ID. You still need to add
     * `google_ads_iframe_` to the beginning or whatever it is to get the element's full ID.
     */
    iframeId: string
}
