import type { Site, SiteGroup } from './site'

export const acthpa: SiteGroup =
    { name: 'Canberra (ACTHPA)'
    , path: 'acthpa'
    }

export const springhill: Site =
    { name: 'Spring Hill'
    , group: acthpa
    , path: 'springhill'
    , timezone: 'Australia/Sydney'
    , speedLowMph: 13
    , speedOnMph: 18
    , speedMarginalMph: 22
    , speedMaxMph: 150 // max recordable wind speed to cancel out electrical interference
    , dirOnDeg: 280
    , dirWidthDeg: 45
    , altitudeFt: 2870
    , dirAdjust: 0
    }

export const lakegeorge: Site =
    { name: 'Lake George'
    , group: acthpa
    , path: 'lakegeorge'
    , timezone: 'Australia/Sydney'
    , speedLowMph: 8
    , speedOnMph: 15
    , speedMarginalMph: 18
    , speedMaxMph: 150
    , dirOnDeg: 80
    , dirWidthDeg: 45
    , altitudeFt: 2185
    , dirAdjust: 0
    }

export const lanyon: Site =
    { name: 'Lanyon (Big Monks)'
    , group: acthpa
    , path: 'lanyon'
    , timezone: 'Australia/Sydney'
    , speedLowMph: 8
    , speedOnMph: 13
    , speedMarginalMph: 20
    , speedMaxMph: 150
    , dirOnDeg: 280
    , dirWidthDeg: 45
    , altitudeFt: 2970
    , dirAdjust: 0
    }

export const nevic: SiteGroup =
    { name: 'North East Victoria'
    , path: 'nevic'
    }

export const mystic: Site =
    { name: 'Mystic'
    , group: nevic
    , path: 'mystic'
    , timezone: 'Australia/Melbourne'
    , speedLowMph: 1
    , speedOnMph: 12
    , speedMarginalMph: 14
    , speedMaxMph: 150
    , dirOnDeg: 350
    , dirWidthDeg: 40
    , altitudeFt: 2615
    , dirAdjust: 0
    }

export const gundowring: Site =
    { name: 'Gundowring'
    , group: nevic
    , path: 'gundowring'
    , timezone: 'Australia/Melbourne'
    , speedLowMph: 1
    , speedOnMph: 13
    , speedMarginalMph: 16
    , speedMaxMph: 150
    , dirOnDeg: 285
    , dirWidthDeg: 50
    , altitudeFt: 2110
    , dirAdjust: 0
    }

export const mtemu: Site =
    { name: 'Mt Emu'
    , group: nevic
    , path: 'emu'
    , timezone: 'Australia/Melbourne'
    , speedLowMph: 1
    , speedOnMph: 12
    , speedMarginalMph: 14
    , speedMaxMph: 150
    , dirOnDeg: 258.75
    , dirWidthDeg: 33.75
    , altitudeFt: 3200
    , dirAdjust: 0
    }

export const buckland: Site =
    { name: 'Buckland Ridge'
    , group: nevic
    , path: 'buckland'
    , timezone: 'Australia/Melbourne'
    , speedLowMph: 1
    , speedOnMph: 13
    , speedMarginalMph: 16
    , speedMaxMph: 150
    , dirOnDeg: 213.75
    , dirWidthDeg: 33.75
    , altitudeFt: 1845
    , dirAdjust: 0
    }

/* todo: two directions! */
export const porepunkah: Site =
    { name: 'Porepunkah'
    , group: nevic
    , path: 'porepunkah'
    , timezone: 'Australia/Melbourne'
    , speedLowMph: 1
    , speedOnMph: 12
    , speedMarginalMph: 14
    , speedMaxMph: 150
    , dirOnDeg: 13
    , dirWidthDeg: 30
    /* , dirOnDeg: 193
    , dirWidthDeg: 30 */
    , altitudeFt: 935
    , dirAdjust: -77
    }

export const corryong: Site =
    { name: 'Corryong'
    , group: nevic
    , path: 'corryong'
    , timezone: 'Australia/Melbourne'
    , speedLowMph: 1
    , speedOnMph: 12
    , speedMarginalMph: 14
    , speedMaxMph: 150
    , dirOnDeg: 290
    , dirWidthDeg: 35
    , altitudeFt: 3010
    , dirAdjust: 0
    }

export const svic: SiteGroup =
    { name: 'South Victoria'
    , path: 'svic'
    }

export const flowerdale: Site =
    { name: 'Flowerdale'
    , group: svic
    , path: 'flowerdale'
    , timezone: 'Australia/Melbourne'
    , speedLowMph: 6
    , speedOnMph: 12
    , speedMarginalMph: 14
    , speedMaxMph: 150
    , dirOnDeg: 350
    , dirWidthDeg: 40
    , altitudeFt: 1600
    , dirAdjust: 0
    }


export const mtbroughton: Site =
    { name: 'Mt Broughton (Thistle Hill)'
    , group: svic
    , path: 'mtbroughton'
    , timezone: 'Australia/Melbourne'
    , speedLowMph: 6
    , speedOnMph: 12
    , speedMarginalMph: 14
    , speedMaxMph: 150
    , dirOnDeg: 225
    , dirWidthDeg: 40
    , altitudeFt: 2100
    , dirAdjust: 0
    }

export const pops: Site =
    { name: 'Pops'
    , group: undefined
    , path: 'pops'
    , timezone: 'Australia/Melbourne'
    , speedLowMph: 3
    , speedOnMph: 12
    , speedMarginalMph: 18
    , speedMaxMph: 150
    , dirOnDeg: 22
    , dirWidthDeg: 45
    , altitudeFt: 885
    , dirAdjust: 0
    }

export const tunk: Site =
    { name: 'Tunk'
    , group: undefined
    , path: 'tunk'
    , timezone: 'Australia/Melbourne'
    , speedLowMph: 11.5
    , speedOnMph: 17.2
    , speedMarginalMph: 20.7
    , speedMaxMph: 150
    , dirOnDeg: 180
    , dirWidthDeg: 30
    , altitudeFt: 280
    , dirAdjust: 0
    }

export const kurutake: Site =
    { name: 'Kurutake'
    , group: undefined
    , path: 'kurutake'
    , timezone: 'Asia/Tokyo'
    , speedLowMph: 1
    , speedOnMph: 9
    , speedMarginalMph: 14
    , speedMaxMph: 150
    , dirOnDeg: 160
    , dirWidthDeg: 70
    , altitudeFt: 1493
    , dirAdjust: 0
    }

export const allSites: Array<Site> =
    [ springhill
    , lakegeorge
    , lanyon
    , mystic
    , gundowring
    , mtemu
    , buckland
    , porepunkah
    , corryong
    , flowerdale
    , mtbroughton
    , pops
    , tunk
    , kurutake
    ]

function groupSites(group: SiteGroup, sites: Array<Site>): Array<Site> {
    return sites.filter(site => site.group === group)
}

export const acthpaSites = groupSites(acthpa, allSites)
export const nevicSites = groupSites(nevic, allSites)
export const svicSites = groupSites(svic, allSites)
