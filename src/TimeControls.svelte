<script lang="ts">
    import { goto } from '$app/navigation'
    import * as d3Scale from 'd3-scale';

    import { DateInput } from 'date-picker-svelte'
    import { minutesIn24Hours, endOfDate } from './date'
    import type { State } from './state'

    import { settings, clampMinutesToShow } from './settings'

    export let state: State

    $: {
        // Show 24 hours if a date is picked
        if (state.date !== null) {
            state.minutesToShow = minutesIn24Hours
            state.date = endOfDate(state.date)
        }
    }

    function setCurrent(minutes: number): void {
        state.date = null
        state.minutesToShow = minutes
    }

    const minutesRange = [settings.minutesToShowMin, settings.minutesToShowMax]
    const sliderRange = [0, 999]
    const sliderScale = d3Scale.scaleLog(minutesRange, sliderRange)
</script>

<div class="w-full pb-0 mt-2 {state.compact ? "hidden" : ""}">
    <DateInput bind:value={state.date} placeholder={"current"} format={"yyyy-MM-dd"} max={endOfDate(new Date(Date.now()))} />
    <input class="w-96 max-w-full" value={sliderScale(state.minutesToShow)} on:input={e => setCurrent(Math.round(sliderScale.invert(parseInt(e.currentTarget.value))))} type="range" min={sliderRange[0]} max={sliderRange[1]} id="minutesToShow" /><br />
    <button class="{state.minutesToShow == 10 ? 'enabled' : ''}" on:click={() => setCurrent(10)}>10 mins</button>
    <button class="{state.minutesToShow == 60 ? 'enabled' : ''}" on:click={() => setCurrent(60)}>1 hour</button>
    <button class="{state.minutesToShow == 4 * 60 ? 'enabled' : ''}" on:click={() => setCurrent(4 * 60)}>4 hours</button>
    <button class="{state.minutesToShow == 12 * 60 ? 'enabled' : ''}" on:click={() => setCurrent(12 * 60)}>12 hours</button>
    <button class="{state.minutesToShow == 24 * 60 ? 'enabled' : ''}" on:click={() => setCurrent(24 * 60)}>24 hours</button>
</div>

<style type="text/postcss">
    button {
        @apply bg-gray-500 text-white font-bold mt-1 py-1 px-2 rounded shadow hover:bg-blue-400 text-sm;
    }

    .enabled {
        @apply bg-blue-500 shadow-inner
    }
</style>
