export interface SiteGroup {
    name: string
    path: string
}

export interface Site {
    name: string
    path: string // Relative to group path
    group: SiteGroup | undefined
    timezone: string
    speedLowMph: number
    speedOnMph: number
    speedMarginalMph: number
    speedMaxMph: number
    dirOnDeg: number
    dirWidthDeg: number
    altitudeFt: number
    dirAdjust: number
}
