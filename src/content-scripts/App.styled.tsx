import * as React from 'react'
import { StyledDiv } from '../common/styles'

export const StyledConsoleTitle: React.StatelessComponent = props =>
    StyledDiv({
        ...props,
        style: {
            position: 'absolute',
            height: '36px',
            width: '100%',
            padding: '8px 12px',
            fontSize: '16px',
            backgroundColor: '#bdbdbd'
        }
    })

export const StyledConsoleBody: React.StatelessComponent = props =>
    StyledDiv({
        ...props,
        style: {
            position: 'absolute',
            height: '36px',
            width: '100%',
            padding: '8px 12px',
            fontSize: '16px',
            backgroundColor: '#bdbdbd'
        }
    })
