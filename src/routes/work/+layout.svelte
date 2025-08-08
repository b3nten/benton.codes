<script lang="ts">
    import Waypoints from "$lib/components/waypoints.svelte";

    let { children } = $props();
</script>

<main class="max-w-3xl text-[1.125rem] mb-48">
    {@render children()}
</main>
