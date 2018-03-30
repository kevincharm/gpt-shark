browser.runtime.onMessage.addListener(message => {
    console.log('[gpt-shark] received message:', message)
    if (message.command === 'start-listening') {
        browser.runtime
            .sendMessage({
                command: 'start-webrequest-listener'
            })
            .then()
            .catch()
    }
})

console.log('[gpt-shark] Loaded content script.')
