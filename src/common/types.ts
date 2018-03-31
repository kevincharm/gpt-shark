export type Message = GptMessage | CheckAdKeyMessage | VerifyAdKeyMessage | UpdateAdsMapMessage

export interface GptMessage {
    kind: 'gpt-ad-call'
    payload: any
}

export interface CheckAdKeyMessage {
    kind: 'check-ad-key'
    payload: {
        key: string
        iframeId: string
    }
}

export interface VerifyAdKeyMessage {
    kind: 'verify-ad-key'
    payload: {
        key: string
        iframeId: string
    }
}

export interface UpdateAdsMapMessage {
    kind: 'update-ads-map'
}
