<script lang="ts">
    import { DateInput } from 'date-picker-svelte'

    export let minutesToShow: number
    export let date: Date | null | undefined = undefined

    $: {
        // Show 24 hours if a date is picked
        if (date) minutesToShow = 24 * 60
    }

    $: timeText = formatHours(minutesToShow)

    function formatHours(minutes: number): string {
        const minutesNumber = minutes % 60
        const minutesText = minutesNumber == 0 ? "" : (minutesNumber + (minutesNumber == 1 ? " minute" : " minutes"))
        if (minutes < 60) return minutesText
        const hourNumber = Math.floor(minutes / 60)
        if (hourNumber == 1) return hourNumber + " hour" + (minutesText == "" ? "" : ", " + minutesText)
        return hourNumber + " hours" + (minutesText == "" ? "" : ", " + minutesText)
    }

    function setCurrent(minutes: number): void {
        date = null
        minutesToShow = minutes
    }

</script>

<div class="w-full pb-0 mt-2">
    <DateInput bind:value={date} placeholder={"current"} format={"yyyy-MM-dd"} max={new Date(Date.now())} />
    <label class="w-full font-medium" for="minutesToShow" id="minutesToShowLabel">Showing {timeText}</label>
    <input class="w-full" bind:value={minutesToShow} type="range" min="10" max="1440" id="minutesToShow" style="direction: rtl;"/>
    <button class="{minutesToShow == 60 ? 'enabled' : ''}" on:click={() => setCurrent(60)}>1 hour</button>
    <button class="{minutesToShow == 4 * 60 ? 'enabled' : ''}" on:click={() => setCurrent(4 * 60)}>4 hours</button>
    <button class="{minutesToShow == 12 * 60 ? 'enabled' : ''}" on:click={() => setCurrent(12 * 60)}>12 hours</button>
    <button class="{minutesToShow == 24 * 60 ? 'enabled' : ''}" on:click={() => setCurrent(24 * 60)}>24 hours</button>
</div>

<style type="text/postcss">
    button {
        @apply bg-gray-500 text-white font-bold py-1 px-2 rounded shadow hover:bg-blue-400 text-sm;
    }

    .enabled {
        @apply bg-blue-500 shadow-inner
    }
</style>
