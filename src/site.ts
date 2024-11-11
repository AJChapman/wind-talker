export interface SiteGroup {
    name: string
    path: string
}

export interface SiteDirection {
    centerDeg: number // The center of the direction band, in degrees
    halfWidthDeg: number // Half the width of the direction band, in degrees
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

    // Adjustment for directions as they come in (TODO: check this)
    dirAdjust: number

    // The direction at the center of the direction graph.
    // If not defined then graph spans from 0 to 359 degrees.
    dirOnCentre: number | undefined
}
