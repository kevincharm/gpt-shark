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
import { AppState } from '../common/types'

start()
    .then()
    .catch()

async function start() {
    console.log('[gpt-shark] Loaded content script.')

    // Only load in top frame
    if (window.self !== window.top) {
        return
    }

    document.addEventListener('DOMContentLoaded', async () => {
        inject()

        const root = document.createElement('div')
        root.id = 'gpt-shark-root'
        Object.assign(root.style, {
            zIndex: INT32_MAX - 1,
            height: '35vh'
        })
        const state = (await browser.storage.local.get()) as AppState
        toggleVisibility(root, state.enabled)
        document.body.appendChild(root)
        ReactDOM.render(<App />, root as HTMLElement)

        browser.storage.onChanged.addListener((changes, areaName) => {
            if (areaName !== 'local') {
                return
            }

            const enabledChanged = changes['enabled']
            if (enabledChanged) {
                console.log(enabledChanged)
                toggleVisibility(root, !!enabledChanged.newValue)
            }
        })
    })
}

function toggleVisibility(root: HTMLElement, enabled: boolean) {
    // TODO: get initial values before modifying body style
    if (enabled) {
        Object.assign(document.body.style, {
            position: 'absolute',
            width: '100%',
            height: '65vh'
        })
        root.style.visibility = 'visible'
    } else {
        root.style.visibility = 'hidden'
        Object.assign(document.body.style, {
            position: 'initial',
            width: 'initial',
            height: 'initial'
        })
    }
}

async function inject() {
    const script = document.createElement('script')
    // script.src = browser.extension.getURL('/static/js/injectScript.js')
    script.textContent = (await import('../inject')).toString()
    document.body.appendChild(script)
    script.remove()
}

export {}
