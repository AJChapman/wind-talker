const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }

const dateFormat: Intl.DateTimeFormat = new Intl.DateTimeFormat(new Array(), dateOptions)

export function formatDate(date: Date): string {
    return dateFormat.format(date)
}

const dateTimeOptions: Intl.DateTimeFormatOptions = { ...dateOptions, hour: 'numeric', minute: 'numeric', second: 'numeric' }

const dateTimeFormat: Intl.DateTimeFormat = new Intl.DateTimeFormat(new Array(), dateTimeOptions)

export function formatDateTime(date: Date): string {
    return dateTimeFormat.format(date)
}

