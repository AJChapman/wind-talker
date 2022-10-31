import type { Site, SiteGroup } from './site'

export const acthpa: SiteGroup =
    { name: 'ACTHPA'
    , path: 'acthpa'
    }

export const springHill: Site =
    { name:             'Spring Hill'
    , group:            acthpa
    , path:             'springhill'
    , timezone:         'Australia/Sydney'
    , speedLowMph:      13
    , speedOnMph:       18
    , speedMarginalMph: 22
    , speedMaxMph:      150 // max recordable wind speed to cancel out electrical interference
    , dirOnDeg:         280
    , dirWidthDeg:      90
    , altitudeFt:       2870
    , dirAdjust:        0
    }

export const lakeGeorge: Site =
    { name:             'Lake George'
    , group:            acthpa
    , path:             'lakegeorge'
    , timezone:         'Australia/Sydney'
    , speedLowMph:      8
    , speedOnMph:       15
    , speedMarginalMph: 18
    , speedMaxMph:      150
    , dirOnDeg:         80
    , dirWidthDeg:      90
    , altitudeFt:       2185
    , dirAdjust:        0
    }

export const lanyon: Site =
    { name:             'Lanyon (Big Monks)'
    , group:            acthpa
    , path:             'lanyon'
    , timezone:         'Australia/Sydney'
    , speedLowMph:      8
    , speedOnMph:       13
    , speedMarginalMph: 20
    , speedMaxMph:      150
    , dirOnDeg:         280
    , dirWidthDeg:      90
    , altitudeFt:       2970
    , dirAdjust:        0
    }
