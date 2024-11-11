import type { Site, SiteGroup } from './site'

import { buckland, corryong, crackneck, emu, gundowring, killarney, mama, mtinkerman, porepunkah, singlehill, lanyon, softys, springhill, stanwell, stringybark, tunk4, wilsons } from './freeflightwx-sites-autogen'
export { buckland, corryong, crackneck, emu, gundowring, killarney, mama, mtinkerman, porepunkah, singlehill, lanyon, softys, springhill, stanwell, stringybark, tunk4, wilsons }

export const acthpa: SiteGroup =
    { name: 'Canberra (ACTHPA)'
    , path: 'acthpa'
    }

springhill.group = acthpa;
lanyon.group = acthpa;
lanyon.path = 'lanyon'; // Override 'acthpa/lanyon'

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
    , dirOnCentre: undefined
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
    , dirOnCentre: 285
    }

gundowring.group = nevic
emu.group = nevic
buckland.group = nevic
corryong.group = nevic
corryong.path = 'corryong'

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
    , dirOnCentre: undefined
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
    , dirOnCentre: undefined
    }

export const sqld: SiteGroup =
    { name: 'South Queensland'
    , path: 'sqld'
    }

stringybark.group = sqld
mama.group = sqld
killarney.group = sqld
wilsons.group = sqld

export const nqld: SiteGroup =
    { name: 'North Queensland'
    , path: 'nqld'
    }

mtinkerman.group = nqld

export const nsw: SiteGroup =
    { name: 'New South Wales'
    , path: 'nsw'
    }

softys.group = nsw
crackneck.group = nsw
stanwell.group = nsw

export const pops: Site =
    { name: 'Pops'
    , group: nqld
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
    , dirOnCentre: undefined
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
    , dirOnCentre: undefined
    }

export const kuratake: Site =
    { name: 'Kuratake'
    , group: undefined
    , path: 'kuratake'
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
    , dirOnCentre: undefined
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
    , dirOnCentre: undefined
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
    , dirOnCentre: undefined
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
    , dirOnCentre: undefined
    }

// The auto-generated version of this seems to be wrong at time of writing.
export const hooleydooley: Site =
    { name: 'Hooley Dooley'
    , group: nsw
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
    , dirOnCentre: undefined
    }

export const lakestclaire: Site =
    { name: 'Lake St Claire'
    , group: nsw
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
    , dirOnCentre: undefined
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
    , dirOnCentre: undefined
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
    , dirOnCentre: undefined
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
    , dirOnCentre: undefined
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
    , dirOnCentre: undefined
    }

export const allSites: Array<Site> =
    [ springhill
    , lakegeorge
    , lanyon
    , mystic
    , gundowring
    , emu
    , buckland
    , porepunkah
    , corryong
    , flowerdale
    , mtbroughton
    , stringybark
    , mama
    , killarney
    , wilsons
    , hooleydooley
    , softys
    , lakestclaire
    , crackneck
    , stanwell
    , pops
    , mtinkerman
    , singlehill
    , tunk4
    , tunk
    , kuratake
    , eclipselx
    , eclipselx2
    , eclipselx3
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
export const sqldSites = groupSites(sqld)
export const nqldSites = groupSites(nqld)
export const nswSites = groupSites(nsw)

export const allGroups: Array<SiteGroup> =
    [ acthpa
    , nevic
    , svic
    , sqld
    , nqld
    , nsw
    ]

export function siteByPath(path: string, sites: Array<Site> = allSites): Site | undefined {
    return sites.find(site => site.path === path)
}

export function groupByPath(path: string, groups: Array<SiteGroup> = allGroups): SiteGroup | undefined {
    return groups.find(group => group.path === path)
}
