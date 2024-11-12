const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }

const dateFormat: Intl.DateTimeFormat = new Intl.DateTimeFormat(new Array(), dateOptions)

export function formatDate(date: Date): string {
    return dateFormat.format(date)
}

const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', second: 'numeric' }

const timeFormat: Intl.DateTimeFormat = new Intl.DateTimeFormat(new Array(), timeOptions)

export function formatTime(date: Date): string {
    return timeFormat.format(date)
}

const dateTimeOptions: Intl.DateTimeFormatOptions = { ...dateOptions, ...timeOptions }

const dateTimeFormat: Intl.DateTimeFormat = new Intl.DateTimeFormat(new Array(), dateTimeOptions)

export function formatDateTime(date: Date): string {
    return dateTimeFormat.format(date)
}

export function endOfDate(date: Date): Date {
    return new Date(date.setHours(23, 59, 59, 999))
}

export const minutesIn24Hours: number = 1440

export function formatISODate(date: Date): string {
    return date.toISOString().substring(0, 10)
}
