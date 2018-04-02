import { AppState } from './types'
export const INT32_MAX = Math.pow(2, 31) - 1

export function getDefaultAppState(): AppState {
    return {
        enabled: false
    }
}
