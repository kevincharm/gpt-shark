import { GptSharkAdsMap } from '../common/types'
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
            const adsDomMap = Object.keys(ads).map(id => {
                const ad = ads[id]
                const adUnitIdNumber = id.match(/^\/(\d+)\//)
                const adKeyPropertyName = Object.keys(ad).find(key => {
                    const adKey = ad[key]
                    const isNumberString = typeof adKey === 'string' && adKey.match(/^\d+$/)
                    const notId = adUnitIdNumber && adUnitIdNumber[1] !== adKey
                    return !!(isNumberString && notId)
                })
                const adMap: GptSharkAdsMap = {
                    key: ad[adKeyPropertyName!],
                    contentUrl: ad.getContentUrl(),
                    iframeId: id
                }
                return adMap
            })
            script.textContent = JSON.stringify(adsDomMap)
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
