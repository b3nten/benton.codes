<script lang="ts">
import Link from "$lib/components/link.svelte";
import PageHeader from "$lib/components/page_header.svelte";
</script>

<svelte:head>
  <title>solving client-server sync problems</title>
</svelte:head>

<PageHeader content="solving client-server sync problems" />

<div class="space-y-12">
  <p>
    Elysia represents my attempt to address the architectural challenges that
    often emerge when building complex 3D applications with Three.js. While
    Three.js provides excellent low-level rendering capabilities, larger
    projects frequently devolve into tightly coupled code where scene
    management, input handling, and game logic become intertwined. The engine
    implements an actor-component architecture similar to what you'd find in
    Unity or Unreal Engine, where Actors contain multiple behavior components
    that can be mixed and matched. This design promotes code reuse and makes it
    easier to reason about complex scenes with hundreds of interactive objects.
  </p>
</div>
