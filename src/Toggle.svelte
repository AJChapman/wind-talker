<script lang="ts">
    export let label: string | undefined
    export let state: boolean
</script>

<label class="relative inline-flex items-center cursor-pointer">
    <input class="sr-only peer" type="checkbox" bind:checked={state} />
    <div class="w-7 h-4 bg-gray-200 hover:bg-gray-300 peer-focus:outline-0  rounded-full peer transition-all ease-in-out duration-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-600 hover:peer-checked:bg-indigo-700 "></div>
    <span class="ml-1 mr-2 text-gray-600">{label}</span>
</label>
