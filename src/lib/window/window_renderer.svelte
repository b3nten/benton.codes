<script lang="ts">
    import { WindowDirector } from "./window_director.svelte.ts";
    import { browser } from "$app/environment";
    import Window from "./window.svelte";

    let {
        director,
    }: {
        director: WindowDirector;
    } = $props();
</script>

{#if browser}
    {#each director.window_iterator() as window_def (window_def.uuid)}
        <Window {window_def} {director} />
    {/each}
{/if}
