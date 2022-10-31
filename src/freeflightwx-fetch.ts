import * as d3Fetch from 'd3-fetch';
import { backOff } from 'exponential-backoff'

import type { Site } from './site'
import { sitePath } from './site'
import type { Sample } from './sample'
import type { SampleRaw } from './freeflightwx-db'
import { parseSample } from './sample'

const baseUrl = (import.meta.env.MODE == 'development') ? 'http://localhost:8010/proxy/new' : '/new'
// const baseUrl = 'http://freeflightwx.com'

const script = 'fetch.php'

// If msTo is undefined fetches the latest
async function fetchSamples(site: Site, msFrom: number, msTo: number | undefined = undefined): Promise<Array<Sample>> {
    const url = baseUrl + '/' + script + '?site=' + sitePath(site) + '&fromMs=' + msFrom + (msTo !== undefined ? ('&toMs=' + msTo) : '')
    const raw: Array<SampleRaw> | undefined = await d3Fetch.json(url)
    if (raw === undefined || raw.length == 0) throw(`fetchSamples got no samples; site: '${site.name}' msFrom: '${msFrom}' msTo: '${msTo}'`)
    return raw.map(parseSample)
}

export async function fetchSamplesBackoff(site: Site, msFrom: number, msTo: number | undefined = undefined): Promise<Array<Sample>> {
    try {
        return backOff(() => fetchSamples(site, msFrom, msTo),
            { jitter: "full" // So many clients don't rhythmically whack the server
            , maxDelay: 60000 // 60 seconds
            , numOfAttempts: Infinity // Keep on trying
            , startingDelay: 1000 // Wait a second after the first attempt returns no results
            })
    } catch (e) {
        console.log("fetchSamplesBackoff failed to fetch samples: " + e)
        return []
    }
}
