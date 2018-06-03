/**
 * WebExtension popup script entry.
 * This is the popup that appears when you click on the extension's icon
 * in your browser's toolbar.
 */
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'
import './index.css'

document.addEventListener('DOMContentLoaded', () => {
    console.log('trying to mount...')
    ReactDOM.render(<App />, document.getElementById('root') as HTMLElement)
})
