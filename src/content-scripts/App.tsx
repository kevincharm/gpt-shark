import * as React from 'react'
import { Message } from '../common/types'
import { parseGptPayload, GptRequest } from './gpt'
import GptRequestItem from './GptRequestItem'

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

    render() {
        return (
            <div className="gpt-shark-console">
                <div className="gpt-shark-console__title">GPT SHARK</div>
                <div className="gpt-shark-console__body">
                    {this.state.requests.map((request, r) => <GptRequestItem key={r} request={request} />)}
                </div>
            </div>
        )
    }
}

export default App
