import * as React from 'react'
import { GptSlot } from './gpt'
import { INT32_MAX } from '../common/constants'

export interface State {
    forceHighlight: boolean
}

export interface Props {
    slot: GptSlot
}

export default class GptSlotItem extends React.Component<Props, State> {
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

    render() {
        const slot = this.props.slot

        const targeting = Object.keys(slot.targeting)
            .filter(key => !!slot.targeting[key])
            .map(key => {
                return (
                    <div key={key}>
                        {key}: {slot.targeting[key]}
                    </div>
                )
            })

        const highlightButtonLabel = this.state.forceHighlight ? 'Unhighlight' : 'Highlight'

        return (
            <div
                className="gpt-shark-console__slot"
                onMouseEnter={this.onMouseEnter(slot)}
                onMouseLeave={this.onMouseLeave(slot)}
            >
                <div>{slot.sizes.join(',')}</div>
                <div>correlator: {slot.correlator}</div>
                {targeting}
                <button onClick={this.onClick(slot)}>{highlightButtonLabel}</button>
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
            return
        }

        try {
            const rawAdsMap = document.getElementById('gpt-shark-ads-map')!.textContent
            const adsMap = JSON.parse(rawAdsMap || '[]') as Array<{ key: string; iframeId: string }>
            const adMap = adsMap.find(ad => ad.key === slot.key)
            if (!adMap) {
                return
            }

            const iframeId = `google_ads_iframe_${adMap.iframeId}`
            const matchedIframe = document.getElementById(iframeId) as HTMLIFrameElement | null

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

        document.body.removeChild(existingHighlightEl)
    }
}

function createHighlightElement(slot: GptSlot, iframe: HTMLIFrameElement) {
    const iframeRect = iframe.getBoundingClientRect()
    const highlightEl = document.createElement('div')
    highlightEl.id = slotDivId(slot)
    Object.assign(highlightEl.style, {
        zIndex: INT32_MAX - 2,
        position: 'absolute',
        content: ' ',
        top: `${iframeRect.top + window.scrollY}px`,
        left: `${iframeRect.left + window.scrollX}px`,
        height: `${iframeRect.height}px`,
        width: `${iframeRect.width}px`,
        backgroundColor: 'rgba(255,236,179,0.8)',
        borderStyle: 'solid',
        borderWidth: '1px',
        borderColor: '#ffd54f'
    })
    document.body.appendChild(highlightEl)
}

function slotDivId(slot: GptSlot) {
    return `gpt-shark-highlight__${slot.key}`
}
