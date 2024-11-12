import * as d3Fetch from 'd3-fetch';
import { backOff } from 'exponential-backoff'

import { base } from '$app/paths'

import type { Site } from './site'
import type { Sample, SampleFull } from './sample'
import type { SampleRaw, SampleRawFull } from './freeflightwx-db'
import { parseSample, parseSampleFull } from './sample'

const baseUrl = `//freeflightwx.com${base}`
const script = 'fetch.php'

// If msTo is undefined fetches the latest
async function fetchSamples(site: Site, msFrom: number, msTo: number | undefined = undefined): Promise<Array<Sample>> {
    // if (msTo === undefined) console.log("fetchSamples() from: " + new Date(msFrom))
    // else console.log("fetchSamples() from: " + new Date(msFrom) + " to: " + new Date(msTo))
    const url = baseUrl + '/' + script + '?site=' + site.path + '&fromMs=' + msFrom + (msTo !== undefined ? ('&toMs=' + msTo) : '')
    const raw: Array<SampleRaw> | undefined = await d3Fetch.json(url)
    if (raw === undefined || raw.length == 0) throw(`fetchSamples got no samples; site: '${site.name}' msFrom: '${msFrom}' msTo: '${msTo}'`)
    return raw.map(parseSample)
}

async function fetchSamplesFull(site: Site, msFrom: number, msTo: number | undefined = undefined): Promise<Array<SampleFull>> {
    const url = baseUrl + '/' + script + '?site=' + site.path + '&fromMs=' + msFrom + (msTo !== undefined ? ('&toMs=' + msTo) : '') + '&allFields'
    const raw: Array<SampleRawFull> | undefined = await d3Fetch.json(url)
    if (raw === undefined || raw.length == 0) throw(`fetchSamplesFull got no samples; site: '${site.name}' msFrom: '${msFrom}' msTo: '${msTo}'`)
    return raw.map(parseSampleFull)
}

const backoffOpts = { jitter: "full" // So many clients don't rhythmically whack the server
                    , maxDelay: 60000 // 60 seconds
                    , numOfAttempts: Infinity // Keep on trying
                    , startingDelay: 1000 // Wait a second after the first attempt returns no results
                    }

export async function fetchSamplesBackoff(site: Site, msFrom: number, msTo: number | undefined = undefined): Promise<Array<Sample>> {
    try {
        return backOff(() => fetchSamples(site, msFrom, msTo), backoffOpts)
    } catch (e) {
        console.log("fetchSamplesBackoff failed to fetch samples: " + e)
        return []
    }
}

export async function fetchSamplesFullBackoff(site: Site, msFrom: number, msTo: number | undefined = undefined): Promise<Array<SampleFull>> {
    try {
        return backOff(() => fetchSamplesFull(site, msFrom, msTo), backoffOpts)
    } catch (e) {
        console.log("fetchSamplesFullBackoff failed to fetch samples: " + e)
        return []
    }
}
