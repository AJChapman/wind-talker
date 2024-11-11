<script lang="ts">

    export let minutesToShow: number

    $: timeText = formatHours(minutesToShow)

    function formatHours(minutes: number): string {
        const minutesNumber = minutes % 60
        const minutesText = minutesNumber == 0 ? "" : (minutesNumber + (minutesNumber == 1 ? " minute" : " minutes"))
        if (minutes < 60) return minutesText
        const hourNumber = Math.floor(minutes / 60)
        if (hourNumber == 1) return hourNumber + " hour" + (minutesText == "" ? "" : ", " + minutesText)
        return hourNumber + " hours" + (minutesText == "" ? "" : ", " + minutesText)
    }

</script>

<div class="w-full p-4">
    <label class="w-full" for="minutesToShow" id="minutesToShowLabel">Showing {timeText}</label>
    <input class="w-full" bind:value={minutesToShow} type="range" min="10" max="1440" id="minutesToShow" style="direction: rtl;"/>
</div>
