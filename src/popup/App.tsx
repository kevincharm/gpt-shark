import * as React from 'react'
import './App.css'
import { AppState } from '../common/types'
import { getDefaultAppState } from '../common/constants'

class App extends React.Component<{}, {}> {
    constructor(props: any) {
        super(props)
    }

    toggleEnabled = async () => {
        const state = (await browser.storage.local.get('enabled')) as AppState

        let newState: AppState
        if (!state) {
            newState = getDefaultAppState()
        } else {
            newState = {
                enabled: !state.enabled
            }
        }

        await browser.storage.local.set(newState)
    }

    render() {
        return (
            <div className="App">
                <button onClick={this.toggleEnabled}>Toggle on/off</button>
            </div>
        )
    }
}

export default App
