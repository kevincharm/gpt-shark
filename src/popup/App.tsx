import * as React from 'react'
import './App.css'

const logo = require('./logo.svg')

class App extends React.Component<{}, {}> {
    constructor(props: any) {
        super(props)
    }

    showInterface = async () => {
        // TODO: Show injected content-scripts interface
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <button onClick={this.showInterface}>Test</button>
            </div>
        )
    }
}

export default App
