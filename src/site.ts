export interface SiteGroup {
    name: string
    path: string
}

export interface SiteDirection {
    centerDeg: number // The center of the direction band, in degrees
    halfWidthDeg: number /// Half the width of the direction band, in degrees
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
    directions: Array<SiteDirection>
    altitudeFt: number
    dirAdjust: number
}
