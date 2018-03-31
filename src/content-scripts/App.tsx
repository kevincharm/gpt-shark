import * as React from 'react'
import { Message } from '../common/types'
import { parseGptPayload, GptSlot } from './gpt'
import GptRequestItem from './GptRequestItem'
import deepEqual = require('deep-equal')

interface State {
    slots: GptSlot[]
}

class App extends React.Component<{}, State> {
    constructor(props: any) {
        super(props)

        this.state = {
            slots: []
        }

        browser.runtime.onMessage.addListener(this.messageListener)
    }

    messageListener = (message: Message) => {
        console.log('[gpt-shark] received message:', message)
        if (message.kind === 'gpt-ad-call') {
            console.log('[gpt-shark]', message.payload)
            const parsedGptPayload = parseGptPayload(message.payload)
            const { slots } = parsedGptPayload

            const resolvedSlots = this.state.slots.slice()
            const newSlots = slots.slice()
            while (newSlots.length) {
                const newSlot = newSlots.pop()!
                const existing = resolvedSlots.find(oldSlot => deepEqual(newSlot.targeting, oldSlot.targeting))
                if (existing) {
                    const index = resolvedSlots.indexOf(existing)
                    resolvedSlots.splice(index, 1, newSlot)
                    continue
                }

                resolvedSlots.push(newSlot)
            }

            this.setState({
                slots: resolvedSlots
            })
        }
    }

    render() {
        return (
            <div className="gpt-shark-console">
                <div className="gpt-shark-console__title">GPT SHARK</div>
                <div className="gpt-shark-console__body">
                    {<GptRequestItem request={{ correlator: '', slots: this.state.slots }} />}
                </div>
            </div>
        )
    }
}

export default App
