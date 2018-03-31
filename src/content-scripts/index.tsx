import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'
import './index.css'
import { INT32_MAX } from '../common/constants'

start()
    .then()
    .catch()

async function start() {
    console.log('[gpt-shark] Loaded content script.', window.frameElement && window.frameElement.id)

    if (window.self !== window.top) {
        return
    }

    document.addEventListener('DOMContentLoaded', () => {
        const script = document.createElement('script')
        script.src = browser.extension.getURL('/inject.js')
        document.body.appendChild(script)
        script.remove()

        const el = document.createElement('div')
        el.id = 'gpt-shark-root'
        Object.assign(el.style, {
            zIndex: INT32_MAX - 1,
            height: '30vh'
        })
        document.body.appendChild(el)
        Object.assign(document.body.style, {
            position: 'absolute',
            width: '100%',
            height: '70vh'
        })
        ReactDOM.render(<App />, el as HTMLElement)
    })
}

export {}
