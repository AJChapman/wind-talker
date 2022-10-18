<script lang="ts">
  import { select } from 'd3-selection'
  import type { Axis } from 'd3-axis'

  export let x: number
  export let y: number
  export let axis: Axis<any>

  let g: SVGGElement
  $: {
    select(g).selectAll("*").remove()
    select(g).call(axis)
  }
</script>

<g class="axis" bind:this={g} transform='translate({x} {y})' />
