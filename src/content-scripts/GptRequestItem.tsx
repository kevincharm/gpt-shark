import * as React from 'react'
import GptSlotItem from './GptSlotItem'
import { GptRequest } from './gpt'

export interface Props {
    request: GptRequest
}

export default class GptRequestItem extends React.Component<Props, {}> {
    constructor(props: Props) {
        super(props)
    }

    mapSlots() {
        const slots = this.props.request.slots
        return slots.map((slot, s) => <GptSlotItem key={s} slot={slot} />)
    }

    render() {
        return <div className="gpt-shark-console__request">{this.mapSlots()}</div>
    }
}
