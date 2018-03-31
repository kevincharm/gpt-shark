import * as React from 'react'
import { GptSlot } from './gpt'
import { INT32_MAX } from '../common/constants'

export interface Props {
    forceHighlightAll: boolean
    slot: GptSlot
}

export interface State {
    forceHighlight: boolean
}

export default class GptSlotItem extends React.Component<Props, State> {
    constructor(props: Props, state: State) {
        super(props, state)
        this.state = {
            forceHighlight: false
        }

        resolveHighlightVisibility(this.props.slot, this.props.forceHighlightAll || this.state.forceHighlight)
    }

    componentWillReceiveProps(nextProps: Props) {
        if (nextProps.forceHighlightAll === this.props.forceHighlightAll) {
            return
        }

        const slot = this.props.slot
        resolveHighlightVisibility(slot, nextProps.forceHighlightAll)

        this.setState({
            forceHighlight: nextProps.forceHighlightAll
        })
    }

    onMouseEnter = () => {
        const slot = this.props.slot
        highlightGptIframe(slot)
    }

    onMouseLeave = () => {
        const slot = this.props.slot
        if (!this.state.forceHighlight) {
            unhighlightGptIframe(slot)
        }
    }

    onClick = () => {
        const slot = this.props.slot
        const currentState = this.state.forceHighlight

        resolveHighlightVisibility(slot, !currentState)

        this.setState({
            forceHighlight: !currentState
        })
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
            <div className="gpt-shark-console__slot" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                <div>{slot.sizes.join(',')}</div>
                <div>correlator: {slot.correlator}</div>
                {targeting}
                <button onClick={this.onClick}>{highlightButtonLabel}</button>
            </div>
        )
    }
}

function resolveHighlightVisibility(slot: GptSlot, highlight: boolean) {
    if (highlight) {
        highlightGptIframe(slot)
    } else {
        unhighlightGptIframe(slot)
    }
}

/**
 * Finds the GPT iframe for the given slot, then highlights it.
 */
function highlightGptIframe(slot: GptSlot) {
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

/**
 * Finds the highlight div element for the given slot, then removes it if it exists.
 */
function unhighlightGptIframe(slot: GptSlot) {
    const existingHighlightEl = document.getElementById(slotDivId(slot))
    if (!existingHighlightEl) {
        return
    }

    document.body.removeChild(existingHighlightEl)
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
