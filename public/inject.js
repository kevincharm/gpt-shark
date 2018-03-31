/**
 * TODO: Transpile this or something.
 */
;(function() {
    const script = document.createElement('script')
    script.type = 'application/json'
    script.id = 'gpt-shark-ads-map'
    script.textContent = '[]'
    document.body.appendChild(script)

    loadAdsMap()

    function loadAdsMap() {
        if (typeof googletag !== 'undefined' && googletag.pubadsReady) {
            /**
             * Look for the key of pubads that contains this shape
             *  {
             *      "/8967304/WAN/perthnow/home_0": {
             *          "ka": "264879584"
             *          ...
             *      }
             *  }
             */
            let gkey = 'aa' // usually aa or Z
            const pubads = googletag.pubads()
            for (const key of Object.keys(pubads)) {
                const val = pubads[key]
                if (!val) {
                    continue
                }
                for (const maybeAdUnitPath of Object.keys(val)) {
                    if (maybeAdUnitPath.match(/\/\d+(?:\/[a-z]+)+[a-z]+_\d+/i)) {
                        gkey = key
                    }
                }
            }
            const ads = pubads[gkey]
            const adsDomMap = Object.keys(ads)
                .map(id => {
                    const ad = ads[id]
                    return `{"key":"${ad.ka}","iframeId":"${id}"}`
                })
                .join(',')
            script.textContent = `[${adsDomMap}]`
        } else {
            setTimeout(function() {
                loadAdsMap()
            }, 50)
        }
    }

    window.addEventListener('message', function(event) {
        const message = event.data
        if (message.kind === 'update-ads-map') {
            loadAdsMap()
        }
    })
})()
