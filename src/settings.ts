export interface Settings {
    minutesToShowMin: number
    minutesToShowMax: number
    minutesToShowDefault: number
}

export const minutesIn24Hours: number = 1440

export const settings: Settings =
    { minutesToShowMin: 10
    , minutesToShowMax: minutesIn24Hours
    , minutesToShowDefault: 60
    }

export function clampMinutesToShow(requested: number): number {
    return Math.min(settings.minutesToShowMax, Math.max(settings.minutesToShowMin, requested))
}
