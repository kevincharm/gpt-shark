import * as React from 'react'

export const StyledDiv: React.StatelessComponent<{ style: React.CSSProperties }> = ({ style, children }) => {
    return <div style={style}>{children}</div>
}
