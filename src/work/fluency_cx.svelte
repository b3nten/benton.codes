<script lang="ts">
import Link from "$lib/components/link.svelte";
import PageHeader from "$lib/components/page_header.svelte";
import img01 from "./nice01.jpg";
import img02 from "./nice02.jpg";
import img03 from "./nice03.jpg";
</script>

<svelte:head>
 <title>work - Nice.com microsites</title>
</svelte:head>

<PageHeader content="Project: Nice.com - Frontend Development" />

<div class="space-y-12">
 <div class="flex flex-row items-center">
  <Link href="https://nicecom-landing-page.vercel.app/" external>
   view site
  </Link>
 </div>

 <p>
  I developed a microsite for Nice.com's FluenCX product offering that required
  some creative technical solutions. The site was hosted within their bespoke
  server infrastructure which required specific build outputs, and since we were
  building a single-page experience anyways I chose Vite as the foundation and
  built a custom SSR plugin to handle performance optimization and SEO
  requirements. This approach let us avoid the complexity and overhead that
  comes with larger meta frameworks like Next.js while giving us the control
  over the build that we needed to integrate with their infrastructure.
 </p>

 <a class="block" target="_blank" href={img01}>
  <img src={img01} />
 </a>

 <p>
  The project presented a couple interesting frontend challenges, particularly
  around the custom video player and carousel components due to their design
  requirements. Anyone who has worked with cross-browser video playback
  understands the challenges that we faced. Overall it was a fairly
  straightforward project, complicated slightly by the intense timeline for
  development.
 </p>

 <a class="block" target="_blank" href={img02}>
  <img src={img02} />
 </a>

 <a class="block" target="_blank" href={img03}>
  <img src={img03} />
 </a>
</div>
