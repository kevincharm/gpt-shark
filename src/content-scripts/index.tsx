import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'
import './index.css'
import { Message, VerifyAdKeyMessage, CheckAdKeyMessage } from '../common/types'

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

window.addEventListener('message', event => {
    const message = event.data as Message
    switch (message.kind) {
        case 'check-ad-key':
            checkAdKey(message)
            break
        case 'verify-ad-key':
            verifyAdKey(message)
            break
    }
})

/**
 * Received by iframes.
 */
function checkAdKey(message: CheckAdKeyMessage) {
    console.log(`[gpt-shark] iframe ${window.frameElement.id} received message:`, message)
    const slotKey = message.payload.key
    const scripts = document.querySelectorAll('script')
    console.log('[gpt-shark] iframe matched scripts:', scripts)
    const matchedScripts = Array.from(scripts).filter((script: any) => script.text && script.text.match(slotKey))
    if (!matchedScripts.length) {
        return
    }

    const reply: VerifyAdKeyMessage = {
        kind: 'verify-ad-key',
        payload: {
            key: slotKey,
            iframeId: window.frameElement.id
        }
    }
    window.parent.postMessage(reply, '*')
}

/**
 * Reply from iframes. Received in top frame.
 */
function verifyAdKey(message: VerifyAdKeyMessage) {
    console.log('[gpt-shark] verify-ad-key:', message)
}

export {}
