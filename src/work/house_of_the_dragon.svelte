<script lang="ts">
  import Link from "$lib/components/link.svelte";
  import PageHeader from "$lib/components/page_header.svelte";
  import img01 from "./hod01.webp";
  import img02 from "./hod02.webp";
  import img03 from "./hod03.webp";
  import img04 from "./hod04.webp";
  import img05 from "./hod05.webp";
</script>

<svelte:head>
  <title>work - house of the dragon</title>
</svelte:head>

<PageHeader content="Project: House of the Dragon Microsites" />

<div class="space-y-12">
  <div class="flex flex-row items-center">
    <Link href="https://www.hbo.com/house-of-the-dragon/dragon-index" external>
      go to site
    </Link>
  </div>

  <p>
    I led development of the "Dragon Index" as part of a three-piece microsite
    collection for HBO's House of the Dragon series.
  </p>

  <a class="block" target="_blank" href={img01}>
    <img src={img01} />
  </a>
  <p>
    Built with Next.js and styled using Tailwind CSS, the project required us to
    implement a custom routing solution to achieve the smooth page transitions
    the design called for. The default Next.js routing wasn't going to cut it
    for the cinematic feel we wanted, so we developed our own transition system
    and implemented Wouter for navigation, which came with it's own set of
    challenges.
  </p>
  <a class="block" target="_blank" href={img02}>
    <img src={img02} />
  </a>
  <p>
    Another challenge was implementing custom gesture controls that needed to
    work seamlessly across both mobile and desktop environments. Touch
    interactions, swipe gestures, and hover states all required careful
    consideration to feel natural on each platform. We spent considerable time
    fine-tuning the responsiveness to avoid the clunky interactions that often
    plague cross-device experiences.
  </p>
  <a class="block" target="_blank" href={img03}>
    <img src={img03} />
  </a>
  <a class="block" target="_blank" href={img04}>
    <img src={img04} />
  </a>
  <a class="block" target="_blank" href={img05}>
    <img src={img05} />
  </a>
</div>
