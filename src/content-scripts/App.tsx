import * as React from 'react'
import voidAsyncWrapper from '../common/async-wrapper'
import { Message } from '../common/types'
import { parseGptPayload, GptRequest, GptSlot } from './gpt'

interface State {
    requests: GptRequest[]
}

class App extends React.Component<{}, State> {
    constructor(props: any) {
        super(props)

        this.state = {
            requests: []
        }

        browser.runtime.onMessage.addListener(voidAsyncWrapper(this.messageListener))
    }

    messageListener = async (message: Message) => {
        console.log('[gpt-shark] received message:', message)
        if (message.kind === 'gpt-ad-call') {
            console.log('[gpt-shark]', message.payload)
            this.setState({
                requests: [parseGptPayload(message.payload)].concat(this.state.requests)
            })
        }
    }

    mapSlots() {
        return this.state.requests.map((request, r) => {
            return (
                <div className="gpt-shark-console__request" key={r}>
                    <div className="gpt-shark-console__request__title">New GPT Request</div>
                    {mapSlots(request.slots)}
                </div>
            )
        })
    }

    render() {
        return (
            <div className="gpt-shark-console">
                <div className="gpt-shark-console__title">GPT SHARK</div>
                <div className="gpt-shark-console__body">{this.mapSlots()}</div>
            </div>
        )
    }
}

function mapSlots(slots: GptSlot[]) {
    return slots.map((slot, s) => (
        <div className="gpt-shark-console__slot" key={s}>
            <div>{slot.sizes.join(',')}</div>
            <div>{JSON.stringify(slot.targeting, null, 2)}</div>
        </div>
    ))
}

export default App
