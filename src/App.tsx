import * as React from 'react'
import './App.css'

const logo = require('./logo.svg')

class App extends React.Component<{}, {}> {
    constructor(props: any) {
        super(props)
    }

    startHandler = async () => {
        try {
            const tabs = await browser.tabs.query({ active: true, currentWindow: true })
            await browser.tabs.sendMessage(tabs[0].id!, { command: 'start-listening' })
        } catch (err) {
            console.error(err)
        }
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <button onClick={this.startHandler}>Test</button>
            </div>
        )
    }
}

export default App
