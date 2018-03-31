import * as React from 'react'
import { UpdateAdsMapMessage } from '../common/types'
import { GptRequest, GptSlot } from './gpt'

export interface Props {
    request: GptRequest
}

const GptRequestItem: React.SFC<Props> = ({ request }: Props) => (
    <div className="gpt-shark-console__request">
        <div className="gpt-shark-console__request__title">New GPT Request</div>
        {mapSlots(request.slots)}
    </div>
)

export default GptRequestItem

function mapSlots(slots: GptSlot[]) {
    return slots.map((slot, s) => {
        const targeting = Object.keys(slot.targeting)
            .filter(key => !!slot.targeting[key])
            .map(key => {
                return (
                    <div key={key}>
                        {key}: {slot.targeting[key]}
                    </div>
                )
            })

        return (
            <div className="gpt-shark-console__slot" key={s}>
                <div>{slot.sizes.join(',')}</div>
                <div>correlator: {slot.correlator}</div>
                {targeting}
                <button onClick={highlightGptIframe(slot)}>Highlight</button>
                <button onClick={unhighlightGptIframe(slot)}>Unhighlight</button>
            </div>
        )
    })
}

/**
 * Finds the GPT iframe for the given slot, then highlights it.
 */
function highlightGptIframe(slot: GptSlot) {
    return () => {
        const updateMessage: UpdateAdsMapMessage = {
            kind: 'update-ads-map'
        }
        window.postMessage(updateMessage, '*')

        const existingHighlightEl = document.getElementById(slotDivId(slot))
        if (existingHighlightEl) {
            console.log('[gpt-shark] exists:', existingHighlightEl)
            return
        }

        /*
        const iframes: HTMLIFrameElement[] = Array.from(document.querySelectorAll('iframe[id^="google_ads_iframe_"]'))
        if (!iframes.length) {
            return
        }

        let matchedIframe = null
        for (const iframe of iframes) {
            try {
                const scripts = (iframe as any).contentWindow.document.querySelectorAll('script')
                const matchedScripts = Array.from(scripts).filter(
                    (script: any) => script.text && script.text.match(slot.key)
                )
                if (!matchedScripts.length) {
                    continue
                }
                matchedIframe = iframe
            } catch (err) {
                console.error(err)
                console.log(iframe)
            }
        }
        */

        try {
            const rawAdsMap = document.getElementById('gpt-shark-ads-map')!.textContent
            console.log('[gpt-shark]', rawAdsMap)
            const adsMap = JSON.parse(rawAdsMap || '[]') as Array<{ key: string; iframeId: string }>
            const adMap = adsMap.find(ad => ad.key === slot.key)
            if (!adMap) {
                return
            }

            const iframeId = `google_ads_iframe_${adMap.iframeId}`
            const matchedIframe = document.getElementById(iframeId) as HTMLIFrameElement | null

            console.log('[gpt-shark] matchedIframe:', matchedIframe)
            if (matchedIframe) {
                createHighlightElement(slot, matchedIframe)
            }
        } catch (err) {
            console.error(`[gpt-shark] Couldn't find iframe!`, err)
        }
    }
}

/**
 * Finds the highlight div element for the given slot, then removes it if it exists.
 */
function unhighlightGptIframe(slot: GptSlot) {
    return () => {
        const existingHighlightEl = document.getElementById(slotDivId(slot))
        if (!existingHighlightEl) {
            return
        }

        console.log('[gpt-shark] exists:', existingHighlightEl)
        document.body.removeChild(existingHighlightEl)
    }
}

const INT32_MAX = Math.pow(2, 31) - 1

function createHighlightElement(slot: GptSlot, iframe: HTMLIFrameElement) {
    console.log('[gpt-shark] createHighlightElement:', slot)
    const iframeRect = iframe.getBoundingClientRect()
    const highlightEl = document.createElement('div')
    highlightEl.id = slotDivId(slot)
    Object.assign(highlightEl.style, {
        zIndex: INT32_MAX,
        position: 'absolute',
        content: ' ',
        top: `${iframe.offsetTop}px`,
        left: `${iframe.offsetLeft}px`,
        height: `${iframeRect.height}px`,
        width: `${iframeRect.width}px`,
        backgroundColor: 'red'
    })
    document.body.appendChild(highlightEl)
    console.log('[gpt-shark] append child:', highlightEl)
}

function slotDivId(slot: GptSlot) {
    return `gpt-shark-highlight__${slot.key}`
}
