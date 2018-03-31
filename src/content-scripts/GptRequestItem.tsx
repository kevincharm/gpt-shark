import * as React from 'react'
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
        const existingHighlightEl = document.getElementById(slotDivId(slot))
        if (existingHighlightEl) {
            return
        }

        const iframes: HTMLIFrameElement[] = Array.from(document.querySelectorAll('iframe[id^="google_ads_iframe_"]'))
        if (!iframes.length) {
            return
        }

        let matchedIframe = null
        for (const iframe of iframes) {
            const scripts = Array.from((iframe as any).contentWindow.document.querySelectorAll('script'))
            const matchedScripts = scripts.filter((script: any) => script.text && script.text.match(slot.key))
            if (!matchedScripts.length) {
                continue
            }
            matchedIframe = iframe
        }

        if (matchedIframe) {
            createHighlightElement(slot, matchedIframe)
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

        existingHighlightEl.remove()
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
        top: `${iframeRect.top}px`,
        left: `${iframeRect.left}px`,
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
