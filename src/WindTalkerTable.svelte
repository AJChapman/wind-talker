<script lang="ts">
    import * as d3Array from 'd3-array';
    
    import { onMount, onDestroy, tick } from 'svelte'
    import debounce from 'lodash.debounce'

    import type { Site } from './site'
    import { date, minutesToShow } from './state'
    import { fetchSamplesFullBackoff } from './freeflightwx-fetch'
    import { minutesToMs, secondsToMs, msToSamples, ftToM, roundToDecimal } from './conversion'
    import { formatTime } from './date'

    // Component parameters
    export let site: Site

    const recentSecs: number = 600 // Duration considered in min/max/avg lines. 600 is 10 mins
    const updateNowMs: number = 1000 // How often to update the current time, moving the graph forward
    const visibleRefreshMs: number = 1000 // refresh every second when visible
    const hiddenRefreshMs: number = 30000 // refresh every 30 seconds when invisible

    let visibility: "visible" | "hidden" = "visible"
    $: visible = visibility == "visible"

    $: msToShow = minutesToMs($minutesToShow)

    let loadedSamples: Array<Sample> = new Array()
    $: lastLoadedSample = (loadedSamples.length > 0) ? loadedSamples[loadedSamples.length - 1] : undefined

    let msNow: number = Date.now()
    $: msLastLoadedSample = (lastLoadedSample !== undefined) ? lastLoadedSample.time.getTime() : (msNow - msToShow)
    $: msEarliestToShow = msNow - msToShow

    $: msEarliestToLoad = msEarliestToShow

    let visibleSamples: Array<Sample> = new Array()
    $: visibleSamples = d3Array.filter(loadedSamples, d => d.time.getTime() >= msEarliestToLoad && d.time.getTime() <= msNow)

    function addSamples(newSamples: Sample[]): void {
        // Concatenate and then sort and remove consecutive duplicates
        newSamples = loadedSamples.concat(newSamples)
        newSamples.sort((a, b) => a.id - b.id)
        loadedSamples = newSamples.filter((x, i, a) => (i == 0) || (x.id != a[i - 1].id))
    }

    // Trigger getMissingSamples() whenever msToShow or msNow changes.
    $: requestUpdate(msToShow + msNow)

    $: refreshIntervalMs = visible ? visibleRefreshMs : hiddenRefreshMs

    // Debounce getting missing samples so we don't spam the server too much
    $: requestUpdate = debounce(((_ms: number) => update()), refreshIntervalMs, { leading: true, maxWait: refreshIntervalMs, trailing: true })

    let timer: number | undefined
    onMount(() => startUpdates())
    onDestroy(() => stopUpdates())

    function startUpdates(): void {
        updateNow()
        timer = setInterval(updateNow, updateNowMs)
    }

    function stopUpdates(): void {
        clearInterval(timer)
    }

    $: {
        loadedSamples = new Array()
        visibleSamples = new Array()
        if ($date !== null) {
            msNow = $date.getTime()
        } else {
            msNow = Date.now()
        }
    }

    function updateNow() {
        // Update when we consider 'now' to be.
        // We don't do this continuously because this would produce too much busy-work.
        // Instead we do it at the update interval (visibleRefreshMs when the window is visible).
        // We also don't update when a different date has been picked.
        if ($date === null) {
            msNow = Date.now()
        }
    }

    // We only allow one update to be running at a time.
    // It will keep retrying until it succeeds.
    let updating: boolean = false

    async function update(): Promise<void> {
        if (updating) return
        updating = true
        //console.log(loadedSamples.length > 0 ? loadedSamples[0] : "loaded samples empty")
        const msEarliestLoadedSample = (loadedSamples.length > 0) ? loadedSamples[0].time.getTime() : msNow
        //console.log(msEarliestLoadedSample)
        const msLatestToLoad = Math.min(msNow, msEarliestLoadedSample)
        const msBeforeLoaded = msLatestToLoad - msEarliestToLoad
        if (msBeforeLoaded > 0 && msToSamples(msBeforeLoaded) > 0) {
            // We need to load samples before the first sample
            const newSamples = await fetchSamplesFullBackoff(site, msEarliestToLoad, msLatestToLoad)
            if (newSamples.length > 0) {
                addSamples(newSamples)
            }
            await tick()
        } else {
            // Check whether it's time to start asking for the latest samples
            const samplesMissing = msToSamples(msNow - msLastLoadedSample)
            if (samplesMissing > 0) {
                const newSamples = await fetchSamplesFullBackoff(site, msLastLoadedSample)
                if (newSamples.length > 0) {
                    addSamples(newSamples)
                }
                await tick()
            }
        }
        updating = false
    }
</script>

<table>
    <tr>
        <th>Index</th>
        <th>Time</th>
        <th>Avg (mph)</th>
        <th>Max (mph)</th>
        <th>Min (mph)</th>
        <th>Dir</th>
        <th>Pressure</th>
        <th>QNH</th>
        <th>Temp</th>
        <th>Humidity</th>
        <th>Dew Point</th>
        <th>Cloudbase AMSL</th>
        <th>Battery</th>
        <th>CSQ</th>
    </tr>
    {#each visibleSamples as _, i}
        {@const sample = visibleSamples[visibleSamples.length - 1 - i]}
        <tr class="hover:bg-gray-100">
            <td>{sample.index}</td>
            <td>{formatTime(sample.time)}</td>
            <td>{sample.windSpeedMph}</td>
            <td>{sample.windMaxMph}</td>
            <td>{sample.windMinMph}</td>
            <td>{sample.windDirectionDeg}<!-- TODO: wind direction string --></td>
            <td>{sample.pressure}</td>
            <td>{sample.qnh}</td>
            <td>{sample.temperature}</td>
            <td>{sample.humidity}</td>
            <td>{roundToDecimal(sample.dewPoint, 1)}</td>
            <td>{Math.round(sample.cloudbaseAGLft)}ft ({Math.round(ftToM(sample.cloudbaseAGLft))}m)</td>
            <td>{sample.battery}</td>
            <td>{sample.csq}</td>
        </tr>
    {/each}
</table>

<style type="text/postcss">
    th {
        @apply border px-4 py-2;
    }

    td {
        @apply border px-4 py-2;
    }
</style>
