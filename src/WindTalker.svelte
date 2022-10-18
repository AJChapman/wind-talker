<script lang="ts">
    import * as d3Array from 'd3-array';
    import * as d3Axis from 'd3-axis';
    import * as d3Scale from 'd3-scale';
    import * as d3Shape from 'd3-shape';

    import { onMount } from 'svelte'

    import type { Site } from './site'
    import { fetchSamples } from './freeflightwx-fetch'
    import type { Sample } from './sample'
    import Axis from './Axis.svelte'
    import type { Margin } from './margin'
    import { mphToKt, mphToKmh, minutesToMs, msToSamples, secondsToSamples } from './conversion'

    // Component parameters
    export let site: Site
    export let width: number
    export let height: number
    export let minutesToShow: number

    // Settings
    const margin: Margin = { left: 20, right: 20, top: 30, bottom: 20 }
    const widthKt = 20
    const widthKmh = 30
    const yBetweenGraphs = 25
    const strengthToDirectionGraphHeightRatio = 2 / 3
    const mphHeadroom: number = 4 // How many mph to graph above the maximum shown, so the peak doesn't touch the top of the graph
    const curve: d3Shape.CurveFactory = d3Shape.curveBumpX // method of interpolation between points
    const movingAverageAlpha: number = 0.05 // Lower is smoother, 1.0 is no smoothing
    const recentSecs: number = 600 // Duration considered in min/max/avg lines. 600 is 10 mins
    const refreshIntervalMs = 1000

    // Theme colours
    const colourDanger:      string = '#ff0000'
    const colourDangerMid:   string = '#ff6969'
    const colourDangerBg:    string = '#ffd1d1'
    const colourMarginal:    string = '#ffa700'
    const colourMarginalMid: string = '#ffcb69'
    const colourMarginalBg:  string = '#ffefd1'
    const colourOn:          string = '#008100'
    const colourOnMid:       string = '#69b569'
    const colourOnBg:        string = '#d1e8d1'
    const colourLow:         string = '#88cfec'
    const colourLowMid:      string = '#b9e2f4'
    const colourLowBg:       string = '#e9f5fb'
    const colourAvg:         string = '#a56106'
    const colourLull:        string = '#5381f2'
    const colourPeak:        string = '#ff7de3'
    const colourDirOn:       string = '#008100'
    const colourDirOff:      string = '#8c4521'
    const colourDir:         string = '#ffff00'

    $: msToShow = minutesToMs(minutesToShow)

    let loadedSamples: Array<Sample> = new Array()
    $: lastLoadedSample = (loadedSamples.length > 0) ? loadedSamples[loadedSamples.length - 1] : undefined

    let msNow: number = Date.now()
    $: msEarliestLoadedSample = (loadedSamples.length > 0) ? loadedSamples[0].time.getTime() : msNow
    $: msLastLoadedSample = (lastLoadedSample !== undefined) ? lastLoadedSample.time.getTime() : (msNow - msToShow)
    $: msMissing = msNow - msLastLoadedSample
    $: samplesMissing = msToSamples(msMissing)
    $: msEarliestToShow = msNow - msToShow

    let visibleSamples: Array<Sample> = new Array()
    $: {
        visibleSamples = new Array()
        if (loadedSamples.length > 0) {
            const last = loadedSamples[loadedSamples.length - 1]
            const latestMs = last.time.getTime()
            const earliestMs = latestMs - msToShow
            visibleSamples = d3Array.filter(loadedSamples, d => d.time.getTime() >= earliestMs)
        }
    }

    const xGraphs: number = margin.left
    const yStrengthGraph = margin.top
    const widthScales = widthKt + widthKmh
    $: widthGraph = width - margin.left - widthScales - margin.right
    $: heightGraphs = height - margin.top - yBetweenGraphs - margin.bottom
    $: heightStrengthGraph = Math.ceil(heightGraphs * strengthToDirectionGraphHeightRatio)
    $: yStrengthGraphBottom = yStrengthGraph + heightStrengthGraph
    $: yDirectionGraph = yStrengthGraphBottom + yBetweenGraphs
    $: heightDirectionGraph = heightGraphs - heightStrengthGraph
    $: xRange = [xGraphs, xGraphs + widthGraph]
    $: yStrengthRange = [yStrengthGraphBottom, yStrengthGraph]
    $: yDirectionRange = [yDirectionGraph, yDirectionGraph + heightDirectionGraph]

    $: times = visibleSamples.map(s => s.time)
    $: indices = d3Array.range(times.length)
    $: directions = visibleSamples.map(s => s.windDirectionDeg)
    $: timeRange = [msEarliestToShow, msNow]
    $: windMph = visibleSamples.map(s => s.windSpeedMph)
    $: windMinMph = visibleSamples.map(s => s.windMinMph)
    $: windMaxMph = visibleSamples.map(s => s.windMaxMph)
    $: avgMph = exponentialMovingAverage(windMph, movingAverageAlpha)
    const recentN: number = secondsToSamples(recentSecs)
    $: recentPeakMph = recentPeak(windMaxMph, recentN)
    $: recentLullMph = recentLull(windMinMph, recentN)

    function exponentialMovingAverage(xs: readonly number[], alpha: number): number[] {
        // alpha should be between 0.0 and 1.0, and is the weight of the latest sample
        const beta: number = 1.0 - alpha

        let ema: number[] = []
        xs.forEach((x: number, i: number) => {
            const prev = ema[i - 1]
            ema.push(prev === undefined ? x : alpha * x + beta * prev)
        })
        return ema
    }

    function recentPeak(xs: readonly number[], n: number): number[] { return recent(Math.max, xs, n) }
    function recentLull(xs: readonly number[], n: number): number[] { return recent(Math.min, xs, n) }

    function recent(fn: (x: number, y: number) => number, xs: readonly number[], n: number): number[] {
      // This is O(n * length(xs)), so not terribly efficient
      let results: number[] = []
      xs.forEach((x, i, a) => {
          let result = x
          for (let j = Math.max(0, i - n); j < i; j++) {
              const val = a[j]
              if (typeof val !== 'undefined') result = fn(result, val)
          }
          results.push(result)
      })
      return results
    }

    // Scale up to at least the marginal wind strength, or the max wind strength shown, but no more than the site max.
    $: sampleMaxMph = d3Array.max(windMaxMph)
    $: graphMaxMph = Math.min(site.speedMaxMph, Math.max((sampleMaxMph ? sampleMaxMph : 0) + mphHeadroom, site.speedMarginalMph))
    $: mphDomain = [0, graphMaxMph]
    $: ktDomain = [0, mphToKt(graphMaxMph)]
    $: kmhDomain = [0, mphToKmh(graphMaxMph)]
    const dirDomain = [0, 359] // degrees
    $: dirStartDeg = site.dirOnDeg - site.dirWidthDeg / 2
    $: dirEndDeg = site.dirOnDeg + site.dirWidthDeg / 2
    $: dirScale = d3Scale.scaleLinear(dirDomain, yDirectionRange)
    $: cardinalScale = d3Scale.scalePoint(["N", "NE", "E", "SE", "S", "SW", "W", "NW", ""], yDirectionRange)

    $: xScale = d3Scale.scaleTime().domain(timeRange).range(xRange)
    $: ktScale = d3Scale.scaleLinear(ktDomain, yStrengthRange)
    $: kmhScale = d3Scale.scaleLinear(kmhDomain, yStrengthRange)
    $: mphScale = d3Scale.scaleLinear(mphDomain, yStrengthRange)
    $: timeAxis = d3Axis.axisBottom(xScale).ticks(widthGraph / 70).tickSizeOuter(0)
    $: ktAxis = d3Axis.axisRight(ktScale).ticks(heightStrengthGraph / 20)
    $: kmhAxis = d3Axis.axisRight(kmhScale).ticks(heightStrengthGraph / 20)
    $: cardinalAxis = d3Axis.axisRight(cardinalScale)

    // Define the current wind band (between each sample's low and high)
    $: windArea = d3Shape.area<number>()
        .curve(curve)
        .x(i => xScale(times[i]))
        .y0(i => mphScale(visibleSamples[i].windMinMph))
        .y1(i => mphScale(visibleSamples[i].windMaxMph))
        (indices)

    // Define the area below the current wind band
    $: windAreaBelow = d3Shape.area<number>()
        .curve(curve)
        .x(i => xScale(times[i]))
        .y0(mphScale(0))
        .y1(i => mphScale(visibleSamples[i].windMinMph))
       (indices)

    $: dirLine = d3Shape.line<number>()
        .curve(curve)
        .x(i => xScale(times[i]))
        .y(i => dirScale(directions[i]))
        (indices)

    $: avgLine = d3Shape.line<number>()
        .curve(curve)
        .x(i => xScale(times[i]))
        .y(i => mphScale(avgMph[i]))
        (indices)

    $: recentPeakLine = d3Shape.line<number>()
        .curve(curve)
        .x(i => xScale(times[i]))
        .y(i => mphScale(recentPeakMph[i]))
        (indices)

    $: recentLullLine = d3Shape.line<number>()
        .curve(curve)
        .x(i => xScale(times[i]))
        .y(i => mphScale(recentLullMph[i]))
        (indices)

    function addSamples(newSamples: Sample[]): void {
        // Concatenate and then sort and remove consecutive duplicates
        newSamples = loadedSamples.concat(newSamples)
        newSamples.sort((a, b) => a.id - b.id)
        loadedSamples = newSamples.filter((x, i, a) => (i == 0) || (x.id != a[i - 1].id))
    }

    // We keep track of how far this browser's time differs from that of the last sample on the server.
    // This should account for local time zone differences as well as just a clock that's completely wrong
    let msLocalTimeOffset: number = 0

    function msLocalToServer(msLocal: number): number {
        return msLocal - msLocalTimeOffset
    }

    //function msServerToLocal(msServer: number): number {
    //    return msServer + msLocalTimeOffset
    //}

    async function getLatestSamples() {
        msNow = msLocalToServer(Date.now())

        if (samplesMissing > 0) {
            const newSamples = await fetchSamples(site, msLastLoadedSample)
            addSamples(newSamples)
        }
    }

    // Trigger getMissingSamples() whenever msToShow changes
    async function getMissingSamples() {
        const msBeforeLoaded = msEarliestLoadedSample - timeRange[0]
        if (msBeforeLoaded > 0 && msToSamples(msBeforeLoaded) > 0) {
            const newSamples = await fetchSamples(site, msEarliestToShow, msEarliestLoadedSample)
            addSamples(newSamples)
        }
    }

    let updateTimeout: string | number | NodeJS.Timeout | null = null;
    onMount(() => update())
    function update(): void {
        clearTimeout(updateTimeout)
        getLatestSamples()
        getMissingSamples()
        updateTimeout = setTimeout(update, refreshIntervalMs)
    }
</script>

<svg {width} {height}>
    <!-- time axis -->
    <Axis x={0} y={yStrengthGraphBottom} axis={timeAxis} />

    <!-- kt and kmh axes and labels -->
    <Axis x={xGraphs + widthGraph} y={0} axis={kmhAxis} />
    <text x={xGraphs + widthGraph} y={margin.top - 10} fill="currentColor" text-anchor="start" font-weight="bold" font-size="x-small">kmh</text>
    <Axis x={xGraphs + widthGraph + widthKmh} y={0} axis={ktAxis} />
    <text x={xGraphs + widthGraph + widthKmh} y={margin.top - 10} fill="currentColor" text-anchor="start" font-weight="bold" font-size="x-small">kt</text>

    <!-- clip paths -->
    <clipPath id="clip-low">
        <rect x={xGraphs} y={mphScale(site.speedLowMph)} width={widthGraph} height={mphScale(0) - mphScale(site.speedLowMph)} />
    </clipPath>
    <clipPath id="clip-on">
        <rect x={xGraphs} y={mphScale(site.speedOnMph)} width={widthGraph} height={mphScale(site.speedLowMph) - mphScale(site.speedOnMph)} />
    </clipPath>
    <clipPath id="clip-marginal">
        <rect x={xGraphs} y={mphScale(site.speedMarginalMph)} width={widthGraph} height={mphScale(site.speedOnMph) - mphScale(site.speedMarginalMph)} />
    </clipPath>
    <clipPath id="clip-danger">
        <rect x={xGraphs} y={mphScale(graphMaxMph)} width={widthGraph} height={mphScale(site.speedMarginalMph) - mphScale(graphMaxMph)} />
    </clipPath>

    <!-- zone backgrounds -->
    <rect x={xGraphs} y={0} width={widthGraph} height={heightStrengthGraph} fill={colourDangerBg} clip-path="url(#clip-danger)" />
    <rect x={xGraphs} y={0} width={widthGraph} height={heightStrengthGraph} fill={colourMarginalBg} clip-path="url(#clip-marginal)" />
    <rect x={xGraphs} y={0} width={widthGraph} height={heightStrengthGraph} fill={colourOnBg} clip-path="url(#clip-on)" />
    <rect x={xGraphs} y={0} width={widthGraph} height={heightStrengthGraph} fill={colourLowBg} clip-path="url(#clip-low)" />

    <!-- zones -->
    <path fill={colourLowMid} stroke="none" clip-path="url(#clip-low)" d={windAreaBelow} />
    <path fill={colourLow} stroke="none" clip-path="url(#clip-low)" d={windArea} />
    <path fill={colourOnMid} stroke="none" clip-path="url(#clip-on)" d={windAreaBelow} />
    <path fill={colourOn} stroke="none" clip-path="url(#clip-on)" d={windArea} />
    <path fill={colourMarginalMid} stroke="none" clip-path="url(#clip-marginal)" d={windAreaBelow} />
    <path fill={colourMarginal} stroke="none" clip-path="url(#clip-marginal)" d={windArea} />
    <path fill={colourDangerMid} stroke="none" clip-path="url(#clip-danger)" d={windAreaBelow} />
    <path fill={colourDanger} stroke="none" clip-path="url(#clip-danger)" d={windArea} />

    <!-- recent lines (average, peak, lull) -->
    <path fill="none" stroke={colourAvg} stroke-width={1.5} d={avgLine} />
    <path fill="none" stroke={colourPeak} stroke-width={1.5} d={recentPeakLine} />
    <path fill="none" stroke={colourLull} stroke-width={1.5} d={recentLullLine} />

    <!-- direction graph -->
    <rect fill={colourDirOff} x={xGraphs} y={yDirectionGraph}       width={widthGraph} height={heightDirectionGraph} />
    <rect fill={colourDirOn}  x={xGraphs} y={dirScale(dirStartDeg)} width={widthGraph} height={dirScale(dirEndDeg) - dirScale(dirStartDeg)} />
    <Axis x={xGraphs + widthGraph} y={0} axis={cardinalAxis} />
    <path fill="none" stroke={colourDir} stroke-width={1.5} d={dirLine} />
</svg>
