import * as React from 'react'
import { StyledConsoleTitle, StyledConsoleBody } from './App.styled'
import { Message, GptMessage, UpdateAdsMapMessage } from '../common/types'
import { parseGptPayload, GptSlot } from './gpt'
import GptSlotItem from './GptSlotItem'
// @ts-ignore
import PortalFrame from 'react-portal-frame'
import deepEqual = require('deep-equal')

interface State {
    forceHighlightAll: boolean
    slots: GptSlot[]
}

class App extends React.Component<{}, State> {
    constructor(props: any) {
        super(props)

        this.state = {
            forceHighlightAll: false,
            slots: []
        }

        browser.runtime.onMessage.addListener(this.messageListener)
    }

    onClick = () => {
        this.setState({ forceHighlightAll: !this.state.forceHighlightAll })
    }

    messageListener = (message: Message) => {
        if (message.kind === 'gpt-ad-call') {
            this.gptAdCallHandler(message)
        }
    }

    gptAdCallHandler(message: GptMessage) {
        const parsedGptPayload = parseGptPayload(message.payload)
        const { slots } = parsedGptPayload

        const resolvedSlots = this.state.slots.slice()
        const newSlots = slots.slice()
        while (newSlots.length) {
            const newSlot = newSlots.pop()!
            const existing = resolvedSlots.find(oldSlot => {
                /**
                 * TODO: Might need to include slot.key equality here too.
                 */
                const sameSize = deepEqual(newSlot.sizes, oldSlot.sizes)
                const sameTargeting = deepEqual(newSlot.targeting, oldSlot.targeting)
                return sameSize && sameTargeting
            })
            if (existing) {
                const index = resolvedSlots.indexOf(existing)
                resolvedSlots.splice(index, 1, newSlot)
                continue
            }

            resolvedSlots.push(newSlot)
        }

        this.setState({ slots: resolvedSlots })

        const updateMessage: UpdateAdsMapMessage = {
            kind: 'update-ads-map'
        }
        window.postMessage(updateMessage, '*')
    }

    mapSlots() {
        const { slots, forceHighlightAll } = this.state
        return slots.map((slot, s) => <GptSlotItem key={s} slot={slot} forceHighlightAll={forceHighlightAll} />)
    }

    render() {
        const highlightAllButtonLabel = this.state.forceHighlightAll ? 'Unhighlight All' : 'Highlight All'
        return (
            <PortalFrame>
                <div className="gpt-shark-console">
                    <StyledConsoleTitle>
                        GPT SHARK
                        <button onClick={this.onClick}>{highlightAllButtonLabel}</button>
                    </StyledConsoleTitle>
                    <StyledConsoleBody>{this.mapSlots()}</StyledConsoleBody>
                </div>
            </PortalFrame>
        )
    }
}

export default App
