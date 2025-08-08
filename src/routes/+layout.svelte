<script lang="ts">
  import "../app.css";
  import GridBackground from "$lib/components/grid_bg.svelte";
  import { onNavigate } from "$app/navigation";
  import ProgressBar from "$lib/components/progress_bar.svelte";
  import { is_mounted } from "$lib/misc.svelte";
  import Waypoints from "$lib/components/waypoints.svelte";
  import og_url from "../assets/og.jpg";

  let { children } = $props();

  onNavigate((navigation) => {
    if (
      !document.startViewTransition ||
      typeof navigation.delta !== "undefined"
    )
      return;

    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });

  let mounted = is_mounted();
</script>

<svelte:head>
  <title>benton.codes</title>
  <meta
    name="description"
    content="benton is a software developer specializing in full stack development"
  />
  <meta property="og:url" content="https://benton.codes" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="benton.codes" />
  <meta
    property="og:description"
    content="benton is a software developer specializing in full stack development"
  />
  <meta property="og:image" content={og_url} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta property="twitter:domain" content="benton.codes" />
  <meta property="twitter:url" content="https://benton.codes" />
  <meta name="twitter:title" content="benton.codes" />
  <meta
    name="twitter:description"
    content="benton is a software developer specializing in full stack development"
  />
  <meta name="twitter:image" content={og_url} />
</svelte:head>

<ProgressBar />
<div
  class="min-h-[100svh] p-4 md:p-6"
  style={`_opacity: ${mounted.value ? 1 : 0}`}
>
  <nav class="h-12">
    <Waypoints showHome />
  </nav>
  {@render children()}
</div>
<GridBackground />
