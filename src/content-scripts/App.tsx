import * as React from 'react'
import voidAsyncWrapper from '../common/async-wrapper'
import { Message } from '../common/types'
import { parseGptPayload, GptSlot } from './gpt'

interface State {
    slots: GptSlot[]
}

class App extends React.Component<{}, State> {
    constructor(props: any) {
        super(props)

        this.state = {
            slots: []
        }

        browser.runtime.onMessage.addListener(voidAsyncWrapper(this.messageListener))
    }

    messageListener = async (message: Message) => {
        console.log('[gpt-shark] received message:', message)
        if (message.kind === 'gpt-ad-call') {
            console.log('[gpt-shark]', message.payload)
            this.setState({
                slots: parseGptPayload(message.payload).concat(this.state.slots)
            })
        }
    }

    render() {
        const slots = this.state.slots.map((slot, i) => {
            return (
                <div className="gpt-shark-console__slot" key={i}>
                    <div>{slot.sizes.join(',')}</div>
                    <div>{JSON.stringify(slot.targeting, null, 2)}</div>
                </div>
            )
        })

        return (
            <div className="gpt-shark-console">
                <div className="gpt-shark-console__title">GPT SHARK</div>
                <div className="gpt-shark-console__body">{slots}</div>
            </div>
        )
    }
}

export default App
