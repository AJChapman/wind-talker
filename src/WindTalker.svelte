<script lang="ts">
    import * as d3Array from 'd3-array';
    import * as d3Axis from 'd3-axis';
    import * as d3Scale from 'd3-scale';
    import * as d3Shape from 'd3-shape';

    import { onMount, tick } from 'svelte'
    import VisibilityChange from 'svelte-visibility-change'
    import debounce from 'lodash.debounce'

    import type { Site } from './site'
    import { fetchSamplesBackoff } from './freeflightwx-fetch'
    import type { Sample } from './sample'
    import Axis from './Axis.svelte'
    import type { Margin } from './margin'
    import { mphToKt, mphToKmh, minutesToMs, msToSamples, secondsToSamples, secondsToMs } from './conversion'

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
    const updateNowMs: number = 1000 // How often to update the current time, moving the graph forward
    const visibleRefreshMs: number = 1000 // refresh every second when visible
    const hiddenRefreshMs: number = 30000 // refresh every 30 seconds when invisible

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

    let visibility: "visible" | "hidden" = "visible"
    $: visible = visibility == "visible"

    $: msToShow = minutesToMs(minutesToShow)

    let loadedSamples: Array<Sample> = new Array()
    $: lastLoadedSample = (loadedSamples.length > 0) ? loadedSamples[loadedSamples.length - 1] : undefined

    let msNow: number = Date.now()
    $: msEarliestLoadedSample = (loadedSamples.length > 0) ? loadedSamples[0].time.getTime() : msNow
    $: msLastLoadedSample = (lastLoadedSample !== undefined) ? lastLoadedSample.time.getTime() : (msNow - msToShow)
    $: msEarliestToShow = msNow - msToShow

    // Load more samples before the start of the graph, so that the recent lines are correct
    $: msEarliestToLoad = msEarliestToShow - secondsToMs(recentSecs)

    let visibleSamples: Array<Sample> = new Array()
    $: visibleSamples = d3Array.filter(loadedSamples, d => d.time.getTime() >= msEarliestToLoad)

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

    // Trigger getMissingSamples() whenever msToShow changes.
    // We deliberately don't depend on msEarliestToShow, because this is changed by msNow,
    // which changes much more frequently.
    $: requestUpdate(msToShow)

    $: refreshIntervalMs = visible ? visibleRefreshMs : hiddenRefreshMs

    // Debounce getting missing samples so we don't spam the server too much
    $: requestUpdate = debounce(((ms: number) => update()), refreshIntervalMs, { leading: true, maxWait: refreshIntervalMs, trailing: true })

    onMount(() => setInterval(updateNow, updateNowMs))

    function updateNow() {
        // Update when we consider 'now' to be.
        // We don't do this continuously because this would produce too much busy-work.
        // Instead we do it at the update interval (visibleRefreshMs when the window is visible).
        msNow = Date.now()
        requestUpdate(msToShow)
    }

    // We only allow one update to be running at a time.
    // It will keep retrying until it succeeds.
    let updating: boolean = false

    async function update(): Promise<void> {
        if (updating) return
        updating = true
        const msBeforeLoaded = msEarliestLoadedSample - msEarliestToLoad
        if (msBeforeLoaded > 0 && msToSamples(msBeforeLoaded) > 0) {
            // We need to load samples before the first sample
            const newSamples = await fetchSamplesBackoff(site, msEarliestToLoad, msEarliestLoadedSample)
            if (newSamples.length > 0) {
                addSamples(newSamples)
            }
            await tick()
        } else {
            // Check whether it's time to start asking for the latest samples
            const samplesMissing = msToSamples(msNow - msLastLoadedSample)
            if (samplesMissing > 0) {
                const newSamples = await fetchSamplesBackoff(site, msLastLoadedSample)
                if (newSamples.length > 0) {
                    addSamples(newSamples)
                }
                await tick()
            }
        }
        updating = false
    }
</script>

<VisibilityChange bind:state={visibility} />
<svg {width} {height}>
    <!-- time axis -->
    <Axis x={0} y={yStrengthGraphBottom} axis={timeAxis} />

    <!-- kt and kmh axes and labels -->
    <Axis x={xGraphs + widthGraph} y={0} axis={kmhAxis} />
    <text x={xGraphs + widthGraph} y={margin.top - 10} fill="currentColor" text-anchor="start" font-weight="bold" font-size="x-small">kmh</text>
    <Axis x={xGraphs + widthGraph + widthKmh} y={0} axis={ktAxis} />
    <text x={xGraphs + widthGraph + widthKmh} y={margin.top - 10} fill="currentColor" text-anchor="start" font-weight="bold" font-size="x-small">kt</text>

    <!-- clip paths -->
    <clipPath id="clip-graphs">
        <rect x={xGraphs} y={0} width={widthGraph} height={height} />
    </clipPath>
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
    <path fill="none" clip-path="url(#clip-graphs)" stroke={colourAvg} stroke-width={1.5} d={avgLine} />
    <path fill="none" clip-path="url(#clip-graphs)" stroke={colourPeak} stroke-width={1.5} d={recentPeakLine} />
    <path fill="none" clip-path="url(#clip-graphs)" stroke={colourLull} stroke-width={1.5} d={recentLullLine} />

    <!-- direction graph -->
    <rect fill={colourDirOff} x={xGraphs} y={yDirectionGraph}       width={widthGraph} height={heightDirectionGraph} />
    <rect fill={colourDirOn}  x={xGraphs} y={dirScale(dirStartDeg)} width={widthGraph} height={dirScale(dirEndDeg) - dirScale(dirStartDeg)} />
    <Axis x={xGraphs + widthGraph} y={0} axis={cardinalAxis} />
    <path fill="none" clip-path="url(#clip-graphs)" stroke={colourDir} stroke-width={1.5} d={dirLine} />
</svg>
