export type Message = GptMessage | UpdateAdsMapMessage

export interface GptMessage {
    kind: 'gpt-ad-call'
    payload: any
}

export interface UpdateAdsMapMessage {
    kind: 'update-ads-map'
}
