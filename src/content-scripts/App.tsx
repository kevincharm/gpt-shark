import * as React from 'react'
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

        browser.runtime.onMessage.addListener(this.messageListener)
    }

    messageListener = (message: Message) => {
        console.log('[gpt-shark] received message:', message)
        if (message.kind === 'gpt-ad-call') {
            console.log('[gpt-shark]', message.payload)
            const parsedGptPayload = parseGptPayload(message.payload)

            this.setState({
                requests: [parsedGptPayload].concat(this.state.requests)
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
    return slots.map((slot, s) => {
        const targeting = Object.keys(slot.targeting)
            .filter(key => !!slot.targeting[key])
            .map(key => {
                return (
                    <div key={key}>
                        {key}: {slot.targeting[key]}
                    </div>
                )
            })

        const onClick = () => {
            const iframes = Array.from(document.querySelectorAll('iframe[id^="google_ads_iframe_"]'))
            if (!iframes.length) {
                return
            }

            let matchedIframe = null
            for (const iframe of iframes) {
                const scripts = Array.from((iframe as any).contentWindow.document.querySelectorAll('script'))
                const matchedScripts = scripts.filter((script: any) => script.text && script.text.match(slot.key))
                if (!matchedScripts.length) {
                    continue
                }
                matchedIframe = iframe
            }

            if (matchedIframe) {
                console.log('[gpt-shark] Found GPT iframe:', matchedIframe)
            }
        }

        return (
            <div className="gpt-shark-console__slot" key={s}>
                <div>{slot.sizes.join(',')}</div>
                <div>correlator: {slot.correlator}</div>
                {targeting}
                <button onClick={onClick}>Highlight</button>
            </div>
        )
    })
}

export default App
