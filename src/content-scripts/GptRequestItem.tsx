import * as React from 'react'
import { GptRequest, GptSlot } from './gpt'
import { INT32_MAX } from '../common/constants'

export interface State {
    forceHighlight: boolean
}

export interface Props {
    request: GptRequest
}

export default class GptRequestItem extends React.Component<Props, State> {
    constructor(props: Props, state: State) {
        super(props, state)
        this.state = {
            forceHighlight: false
        }
    }

    onMouseEnter = (slot: GptSlot) => {
        return () => {
            highlightGptIframe(slot)()
        }
    }

    onMouseLeave = (slot: GptSlot) => {
        return () => {
            if (!this.state.forceHighlight) {
                unhighlightGptIframe(slot)()
            }
        }
    }

    onClick = (slot: GptSlot) => {
        return () => {
            const currentState = this.state.forceHighlight

            if (currentState) {
                unhighlightGptIframe(slot)()
            } else {
                highlightGptIframe(slot)()
            }

            this.setState({
                forceHighlight: !currentState
            })
        }
    }

    mapSlots() {
        return this.props.request.slots.map((slot, s) => {
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
                <div
                    className="gpt-shark-console__slot"
                    key={s}
                    onMouseEnter={this.onMouseEnter(slot)}
                    onMouseLeave={this.onMouseLeave(slot)}
                >
                    <div>{slot.sizes.join(',')}</div>
                    <div>correlator: {slot.correlator}</div>
                    {targeting}
                    <button onClick={this.onClick(slot)}>Highlight</button>
                </div>
            )
        })
    }

    render() {
        return (
            <div className="gpt-shark-console__request">
                <div className="gpt-shark-console__request__title">New GPT Request</div>
                {this.mapSlots()}
            </div>
        )
    }
}

/**
 * Finds the GPT iframe for the given slot, then highlights it.
 */
function highlightGptIframe(slot: GptSlot) {
    return () => {
        const existingHighlightEl = document.getElementById(slotDivId(slot))
        if (existingHighlightEl) {
            console.log('[gpt-shark] exists:', existingHighlightEl)
            return
        }

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

function createHighlightElement(slot: GptSlot, iframe: HTMLIFrameElement) {
    console.log('[gpt-shark] createHighlightElement:', slot)
    const iframeRect = iframe.getBoundingClientRect()
    const highlightEl = document.createElement('div')
    highlightEl.id = slotDivId(slot)
    Object.assign(highlightEl.style, {
        zIndex: INT32_MAX - 2,
        position: 'absolute',
        content: ' ',
        top: `${iframe.offsetTop}px`,
        left: `${iframe.offsetLeft}px`,
        height: `${iframeRect.height}px`,
        width: `${iframeRect.width}px`,
        backgroundColor: 'rgba(255,236,179,0.8)',
        borderStyle: 'solid',
        borderWidth: '1px',
        borderColor: '#ffd54f'
    })
    document.body.appendChild(highlightEl)
    console.log('[gpt-shark] append child:', highlightEl)
}

function slotDivId(slot: GptSlot) {
    return `gpt-shark-highlight__${slot.key}`
}
