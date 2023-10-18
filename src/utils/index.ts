export function noZoneDate(dateString: string): Date {
    const zonedDate = new Date(dateString)
    return new Date(zonedDate.toISOString().slice(0, -1))
}

export const NARROWBAND = {name: 'Narrowband', code: 'narrowband'}
export const BROADBAND = {name: 'Broadband', code: 'broadband'}
export const AWESOME = {name: 'AWESOME', code: 'awesome'}
export const SAVNET = {name: 'SAVNET', code: 'savnet'}
