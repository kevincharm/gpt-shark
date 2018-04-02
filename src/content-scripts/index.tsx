/**
 * WebExtension content script entry.
 * Most of the logic should be consolidated into this bundle. This bundle is injected
 * into the page on every page load, but only has access to the page's DOM.
 *
 * A separate script is injected into the page so we can get access to the page's
 * execution context, then we can communicate by serialisation/deserialisation of a
 * script element (#gpt-shark-ads-map)
 */
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'
import './index.css'
import { INT32_MAX } from '../common/constants'

start()
    .then()
    .catch()

async function start() {
    console.log('[gpt-shark] Loaded content script.')

    // Only load in top frame
    if (window.self !== window.top) {
        return
    }

    document.addEventListener('DOMContentLoaded', () => {
        inject()

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

function inject() {
    const script = document.createElement('script')
    script.src = browser.extension.getURL('/static/js/injectScript.js')
    document.body.appendChild(script)
    script.remove()
}

export {}
