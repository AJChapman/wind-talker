<script lang="ts">
    import * as d3Scale from 'd3-scale';

    import { DateInput } from 'date-picker-svelte'
    import { minutesIn24Hours, endOfDate } from './date'
    import { date, minutesToShow, compact } from './state'

    import { settings } from './settings'

    $: {
        // Show 24 hours if a date is picked
        if ($date !== undefined && $date !== null) {
            $minutesToShow = minutesIn24Hours
            $date = endOfDate($date)
        }
    }

    function setCurrent(minutes: number): void {
        $date = null
        $minutesToShow = minutes
    }

    const minutesRange = [settings.minutesToShowMin, settings.minutesToShowMax]
    const sliderRange = [0, 999]
    const sliderScale = d3Scale.scaleLog(minutesRange, sliderRange)
</script>

<div class="w-full pb-0 mt-2 {$compact ? "hidden" : ""}">
    <button class="{$minutesToShow == 10 ? 'enabled' : ''} hover:bg-blue-400" on:click={() => setCurrent(10)}>10 mins</button>
    <button class="{$minutesToShow == 60 ? 'enabled' : ''} hover:bg-blue-400" on:click={() => setCurrent(60)}>1 hour</button>
    <button class="{$minutesToShow == 4 * 60 ? 'enabled' : ''} hover:bg-blue-400" on:click={() => setCurrent(4 * 60)}>4 hours</button>
    <button class="{$minutesToShow == 12 * 60 ? 'enabled' : ''} hover:bg-blue-400" on:click={() => setCurrent(12 * 60)}>12 hours</button>
    <button class="{$minutesToShow == 24 * 60 ? 'enabled' : ''} hover:bg-blue-400" on:click={() => setCurrent(24 * 60)}>24 hours</button>
    <DateInput class="inline" bind:value={$date} placeholder={"Auto refresh (3s)"} format={"yyyy-MM-dd"} max={endOfDate(new Date(Date.now()))} /><br />
    <input class="mt-2 w-96 max-w-full" value={sliderScale($minutesToShow)} on:input={e => setCurrent(Math.round(sliderScale.invert(parseInt(e.currentTarget.value))))} type="range" min={sliderRange[0]} max={sliderRange[1]} id="minutesToShow" />
</div>

<style type="text/postcss">
    button {
        @apply bg-gray-500 text-white font-bold mt-1 py-1 px-2 rounded shadow /*hover:bg-blue-400*/ text-sm;
    }

    .enabled {
        @apply bg-blue-500 shadow-inner;
    }
</style>
