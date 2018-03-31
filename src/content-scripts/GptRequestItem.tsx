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
            </div>
        )
    })
}

/**
 * Finds the GPT iframe for the given slot, then highlights it.
 */
function highlightGptIframe(slot: GptSlot) {
    return () => {
        const iframes = Array.from(document.querySelectorAll('iframe[id^="google_ads_iframe_"]'))
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
            console.log('[gpt-shark] Found GPT iframe:', matchedIframe)
            // const iframeRect = matchedIframe.getBoundingClientRect()
        }
    }
}
