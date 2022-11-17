<script lang="ts">
    import { goto } from '$app/navigation'
    import * as d3Scale from 'd3-scale';

    import { DateInput } from 'date-picker-svelte'

    import { minutesIn24Hours, settings, clampMinutesToShow } from './settings'

    export let date: Date | null | undefined = undefined
    export let minutesToShow: number = settings.minutesToShowDefault
    export let compact: boolean = false

    $: {
        // Show 24 hours if a date is picked
        if (date) minutesToShow = minutesIn24Hours
    }

    function setCurrent(minutes: number): void {
        date = null
        minutesToShow = minutes
    }

    const minutesRange = [settings.minutesToShowMin, settings.minutesToShowMax]
    const sliderRange = [0, 999]
    const sliderScale = d3Scale.scaleLog(minutesRange, sliderRange)
</script>

<div class="w-full pb-0 mt-2 {compact ? "hidden" : ""}">
    <DateInput bind:value={date} placeholder={"current"} format={"yyyy-MM-dd"} max={new Date(Date.now())} />
    <input class="w-96 max-w-full" value={sliderScale(minutesToShow)} on:input={e => setCurrent(Math.round(sliderScale.invert(parseInt(e.currentTarget.value))))} type="range" min={sliderRange[0]} max={sliderRange[1]} id="minutesToShow" /><br />
    <button class="{minutesToShow == 10 ? 'enabled' : ''}" on:click={() => setCurrent(10)}>10 mins</button>
    <button class="{minutesToShow == 60 ? 'enabled' : ''}" on:click={() => setCurrent(60)}>1 hour</button>
    <button class="{minutesToShow == 4 * 60 ? 'enabled' : ''}" on:click={() => setCurrent(4 * 60)}>4 hours</button>
    <button class="{minutesToShow == 12 * 60 ? 'enabled' : ''}" on:click={() => setCurrent(12 * 60)}>12 hours</button>
    <button class="{minutesToShow == 24 * 60 ? 'enabled' : ''}" on:click={() => setCurrent(24 * 60)}>24 hours</button>
</div>

<style type="text/postcss">
    button {
        @apply bg-gray-500 text-white font-bold mt-1 py-1 px-2 rounded shadow hover:bg-blue-400 text-sm;
    }

    .enabled {
        @apply bg-blue-500 shadow-inner
    }
</style>
