<script lang="ts">
  import Link from "$lib/components/link.svelte";
  import PageHeader from "$lib/components/page_header.svelte";
  import elysiaimg from "./elysia.jpg";
</script>

<svelte:head>
  <title>projects - elsyia</title>
</svelte:head>

<PageHeader content="Elysia - webgl game engine" />

<div class="space-y-12">
  <div class="flex flex-row items-center">
    <Link external href="https://github.com/b3nten/elysia">github</Link>
  </div>

  <a class="block" target="_blank" href={elysiaimg}>
    <img class="img" src={elysiaimg} />
  </a>

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

  <p>
    Although Elysia is new and in development, it has been used in production on <a
      class="underline"
      href="https://droplab.com"
      target="_blank">Droplab</a
    >
    and
    <a class="underline" href="https://moonmymeme.com" target="_blank"
      >moon my meme</a
    >, as well as powering prototype visualizations for Droplab.
  </p>

  <p>
    The rendering pipeline includes several optimizations that Three.js doesn't
    provide out of the box. Automatic mesh batching groups materially similar
    objects together to reduce draw calls, which becomes important when
    rendering large numbers of similar meshes. The physics integration through
    Jolt provides collision detection and rigid body dynamics.
  </p>

  <p>
    The renderer abstraction in version 2 decouples the engine from Three.js
    specifically. While Three.js remains the primary backend, the abstraction
    layer means I could theoretically plug in WebGPU, Babylon.js, or even a
    custom renderer without changing most systems or game logic. The development
    tooling has also improved significantly - the debug builds include detailed
    performance profiling, component inspection, and better error messages that
    actually point to your game code rather than deep engine internals.
  </p>
</div>
