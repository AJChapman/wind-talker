import * as d3Fetch from 'd3-fetch';

import type { Site } from './site'
import type { Sample } from './sample'
import type { SampleRaw } from './freeflightwx-db'
import { parseSample } from './sample'

const baseUrl = (import.meta.env.MODE == 'development') ? 'http://localhost:8010/proxy/new' : '/new'
// const baseUrl = 'http://freeflightwx.com'

const script = 'fetch.php'

// If msTo is undefined fetches the latest
export async function fetchSamples(site: Site, msFrom: number, msTo: number | undefined = undefined): Promise<Array<Sample>> {
    const url = baseUrl + '/' + script + '?site=' + site.folder + '&fromMs=' + msFrom + (msTo !== undefined ? ('&toMs=' + msTo) : '')
    let raw: Array<SampleRaw> = await d3Fetch.json(url)
    return raw.map(parseSample)
}

