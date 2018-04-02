/**
 * WebExtension injected script entry.
 * This bundle is injected into the page by the content script,
 * so that we can get access to the page's execution context. More specifically;
 * we need access to the global `window.googletag` used by GPT in the page's
 * execution context.
 */
import { GptSharkAdsMap } from '../common/types'

const script = document.createElement('script')
script.type = 'application/json'
script.id = 'gpt-shark-ads-map'
script.textContent = '[]'
document.body.appendChild(script)

loadAdsMap()

window.addEventListener('message', function(event) {
    const message = event.data
    if (message.kind === 'update-ads-map') {
        loadAdsMap()
    }
})

function loadAdsMap() {
    if (typeof googletag !== 'undefined' && googletag.pubadsReady) {
        const ads = findGptAdMap(googletag.pubads())
        const adsDomMap = parseAdMap(ads)
        script.textContent = JSON.stringify(adsDomMap)
    } else {
        setTimeout(function() {
            loadAdsMap()
        }, 50)
    }
}

/**
 * Looks for the key of pubads that contains this shape
 * ```
 *  {
 *      "/8967304/WAN/perthnow/home_0": {
 *          "ka": "264879584"
 *          ...
 *      }
 *  }
 * ```
 * Then returns the object.
 */
function findGptAdMap(pubads: object) {
    let propertyName = 'aa' // usually aa or Z
    for (const key of Object.keys(pubads)) {
        const val = pubads[key]
        if (!val) {
            continue
        }
        for (const maybeAdUnitPath of Object.keys(val)) {
            if (maybeAdUnitPath.match(/\/\d+(?:\/[a-z]+)+[a-z]+_\d+/i)) {
                propertyName = key
            }
        }
    }
    return pubads[propertyName]
}

/**
 * Returns a typed ad map that we can use for mapping GPT ad slots to iframes.
 */
function parseAdMap(ads: object) {
    return Object.keys(ads).map(id => {
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
}
