import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'
import './index.css'

shim()
start()

function start() {
    console.log('[gpt-shark] Loaded content script.')

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
}

function shim() {
    if (typeof browser === 'undefined') {
        ;(window.browser as any) = {
            runtime: {
                onMessage: {
                    addListener: () => {}
                }
            }
        }
    }
}

export {}
