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
    , directions: [{ centerDeg: 280
                   , halfWidthDeg: 45
                   }]
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
    , directions: [{ centerDeg: 80
                   , halfWidthDeg: 45
                   }]
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
    , directions: [{ centerDeg: 280
                   , halfWidthDeg: 45
                   }]
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
    , directions: [{ centerDeg: 350
                   , halfWidthDeg: 40
                   }]
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
    , directions: [{ centerDeg: 285
                   , halfWidthDeg: 50
                   }]
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
    , directions: [{ centerDeg: 258.75
                   , halfWidthDeg: 33.75
                   }]
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
    , directions: [{ centerDeg: 213.75
                   , halfWidthDeg: 33.75
                   }]
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
    , directions: [ { centerDeg: 13
                    , halfWidthDeg: 30
                    }
                  , { centerDeg: 193
                    , halfWidthDeg: 30
                    }
                  ]
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
    , directions: [{ centerDeg: 290
                   , halfWidthDeg: 35
                   }]
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
    , directions: [{ centerDeg: 350
                   , halfWidthDeg: 40
                   }]
    , altitudeFt: 1600
    , dirAdjust: 0
    }


export const mtbroughton: Site =
    { name: 'Mt Broughton'
    , group: svic
    , path: 'mtbroughton'
    , timezone: 'Australia/Melbourne'
    , speedLowMph: 6
    , speedOnMph: 12
    , speedMarginalMph: 14
    , speedMaxMph: 150
    , directions: [{ centerDeg: 225
                   , halfWidthDeg: 40
                   }]
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
    , directions: [{ centerDeg: 22
                   , halfWidthDeg: 45
                   }]
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
    , directions: [{ centerDeg: 180
                   , halfWidthDeg: 30
                   }]
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
    , directions: [{ centerDeg: 160
                   , halfWidthDeg: 70
                   }]
    , altitudeFt: 1493
    , dirAdjust: 0
    }

// Unlisted sites

export const eclipselx: Site =
    { name: 'eclipselx'
    , group: undefined
    , path: 'eclipselx'
    , timezone: 'Australia/Melbourne'
    , speedLowMph: 0
    , speedOnMph: 31
    , speedMarginalMph: 46.6
    , speedMaxMph: 150
    , directions: [{ centerDeg: 0
                   , halfWidthDeg: 1
                   }]
    , altitudeFt: 1845
    , dirAdjust: 0
    }

export const eclipselx2: Site =
    { name: 'eclipselx2'
    , group: undefined
    , path: 'eclipselx2'
    , timezone: 'Australia/Melbourne'
    , speedLowMph: 0
    , speedOnMph: 31
    , speedMarginalMph: 46.6
    , speedMaxMph: 150
    , directions: [{ centerDeg: 0
                   , halfWidthDeg: 1
                   }]
    , altitudeFt: 1845
    , dirAdjust: 0
    }

export const eclipselx3: Site =
    { name: 'eclipselx3'
    , group: undefined
    , path: 'eclipselx3'
    , timezone: 'Australia/Melbourne'
    , speedLowMph: 1
    , speedOnMph: 12
    , speedMarginalMph: 14
    , speedMaxMph: 150
    , directions: [{ centerDeg: 350
                   , halfWidthDeg: 40
                   }]
    , altitudeFt: 2615
    , dirAdjust: 0
    }

export const hooleydooley: Site =
    { name: 'Hooley Dooley'
    , group: undefined
    , path: 'hooleydooley'
    , timezone: 'Australia/Melbourne'
    , speedLowMph: 3
    , speedOnMph: 12
    , speedMarginalMph: 18
    , speedMaxMph: 150
    , directions: [{ centerDeg: 95
                   , halfWidthDeg: 40
                   }]
    , altitudeFt: 1155
    , dirAdjust: 110
    }

export const lakestclaire: Site =
    { name: 'Lake St Claire'
    , group: undefined
    , path: 'lakestclaire'
    , timezone: 'Australia/Sydney'
    , speedLowMph: 1
    , speedOnMph: 12
    , speedMarginalMph: 14
    , speedMaxMph: 150
    , directions: [{ centerDeg: 350
                   , halfWidthDeg: 40
                   }]
    , altitudeFt: 2615
    , dirAdjust: 0
    }

export const softys: Site =
    { name: 'Softys'
    , group: undefined
    , path: 'softys'
    , timezone: 'Australia/Sydney'
    , speedLowMph: 1
    , speedOnMph: 12
    , speedMarginalMph: 14
    , speedMaxMph: 150
    , directions: [{ centerDeg: 350
                   , halfWidthDeg: 40
                   }]
    , altitudeFt: 2615
    , dirAdjust: 0
    }

export const stringybark: Site =
    { name: 'Stringybark'
    , group: undefined
    , path: 'stringybark'
    , timezone: 'Australia/Brisbane'
    , speedLowMph: 3
    , speedOnMph: 10
    , speedMarginalMph: 15
    , speedMaxMph: 150
    , directions: [{ centerDeg: 90
                   , halfWidthDeg: 90
                   }]
    , altitudeFt: 1440
    , dirAdjust: 0
    }

export const temp: Site =
    { name: 'Temporary'
    , group: undefined
    , path: 'temp'
    , timezone: 'Australia/Melbourne'
    , speedLowMph: 1
    , speedOnMph: 13
    , speedMarginalMph: 16
    , speedMaxMph: 150
    , directions: [{ centerDeg: 165
                   , halfWidthDeg: 40
                   }]
    , altitudeFt: 1845
    , dirAdjust: 0
    }

export const test: Site =
    { name: 'Test'
    , group: undefined
    , path: 'test'
    , timezone: 'Australia/Melbourne'
    , speedLowMph: 1
    , speedOnMph: 12
    , speedMarginalMph: 14
    , speedMaxMph: 150
    , directions: [{ centerDeg: 350
                   , halfWidthDeg: 40
                   }]
    , altitudeFt: 2615
    , dirAdjust: 0
    }

export const winton: Site =
    { name: 'Winton'
    , group: undefined
    , path: 'winton'
    , timezone: 'Australia/Hobart'
    , speedLowMph: 8
    , speedOnMph: 13.8
    , speedMarginalMph: 18
    , speedMaxMph: 150
    , directions: [{ centerDeg: 146.25
                   , halfWidthDeg: 33.75
                   }]
    , altitudeFt: 600
    , dirAdjust: -8
    }

export const woodstock: Site =
    { name: 'Woodstock'
    , group: undefined
    , path: 'woodstock'
    , timezone: 'America/New_York'
    , speedLowMph: 1
    , speedOnMph: 12
    , speedMarginalMph: 14
    , speedMaxMph: 150
    , directions: [{ centerDeg: 350
                   , halfWidthDeg: 40
                   }]
    , altitudeFt: 2615
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
    , eclipselx
    , eclipselx2
    , eclipselx3
    , hooleydooley
    , lakestclaire
    , softys
    , stringybark
    , temp
    , test
    , winton
    , woodstock
    ]

export function groupSites(group: SiteGroup): Array<Site> {
    return allSites.filter(site => site.group === group)
}

export const acthpaSites = groupSites(acthpa)
export const nevicSites = groupSites(nevic)
export const svicSites = groupSites(svic)

export const allGroups: Array<SiteGroup> =
    [ acthpa
    , nevic
    , svic
    ]

export function siteByPath(path: string, sites: Array<Site> = allSites): Site | undefined {
    return sites.find(site => site.path === path)
}

export function groupByPath(path: string, groups: Array<SiteGroup> = allGroups): SiteGroup | undefined {
    return groups.find(group => group.path === path)
}
