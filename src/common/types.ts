export type Message = BaseMessage | GptMessage

export interface BaseMessage {
    kind: string
    payload?: any
}

export interface GptMessage extends BaseMessage {
    kind: 'gpt-ad-call'
    payload: object
}
