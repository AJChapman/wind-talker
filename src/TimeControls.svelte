<script lang="ts">
    import * as d3Scale from 'd3-scale';

    import { DateInput } from 'date-picker-svelte'

    export let minutesToShow: number
    export let date: Date | null | undefined = undefined

    $: {
        // Show 24 hours if a date is picked
        if (date) minutesToShow = 24 * 60
    }

    function setCurrent(minutes: number): void {
        date = null
        minutesToShow = minutes
    }

    const minutesRange = [10, 1440] // 10 minutes to 24 hours
    const sliderRange = [0, 999]
    const sliderScale = d3Scale.scaleLog(minutesRange, sliderRange)
</script>

<div class="w-full pb-0 mt-2">

    <DateInput bind:value={date} placeholder={"current"} format={"yyyy-MM-dd"} max={new Date(Date.now())} />
    <input class="w-96 max-w-full" value={sliderScale(minutesToShow)} on:input={e => minutesToShow = Math.round(sliderScale.invert(parseInt(e.currentTarget.value)))} type="range" min={sliderRange[0]} max={sliderRange[1]} id="minutesToShow" /><br />
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
