import * as React from 'react'

export const StyledDiv = (style: React.CSSProperties) => {
    return (props: any): React.ReactElement<any> => {
        return (
            <div {...props} style={style}>
                {props.children}
            </div>
        )
    }
}
