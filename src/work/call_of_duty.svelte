<script lang="ts">
 import Link from "$lib/components/link.svelte";
 import PageHeader from "$lib/components/page_header.svelte";
 import cod01 from "./cod01.webp";
 import cod02 from "./cod02.png";
</script>

<svelte:head>
 <title>work - call of duty</title>
</svelte:head>

<PageHeader content="Project: Call Of Duty Black Ops 6 Marketing Experience" />

<div class="space-y-12">
 <div class="flex flex-row items-center">
  <Link href="https://archive-thetruthdies-droplab.vercel.app/" external>
   view demo
  </Link>
 </div>

 <p>
  I developed an interactive marketing experience for Call of Duty: Black Ops 6
  that combined nostalgic analog television aesthetics with modern web
  technologies. The centerpiece was a fully functional webgl TV interface
  powered by Three.js, with authentic CRT scanlines, phosphor glow effects, and
  vintage signal distortion in real-time. The site earned a <Link
   href="https://shortyawards.com/17th/call-of-duty-black-ops-6-the-truth-lies"
   external
  >
   Shorty Silver Honor
  </Link> after amassing 3 million site views in first 72 hours and over 1.27 billion
  earned impressions (don't ask me what that means, but it's a lot).
 </p>

 <a class="block" target="_blank" href={cod02}>
  <img class="img" src={cod02} />
 </a>

 <p>
  The technical implementation involved custom fragment shaders for realistic
  tube television emulation, including chromatic aberration, barrel distortion,
  and dynamic noise generation. I architected the React-based frontend to handle
  complex state management across multiple interactive visual and auditory
  elements, while implementing a modular system for dynamically loading hidden
  content and Easter eggs without disrupting the user experience or revealing
  sensitive information prematurely.
 </p>

 <a class="block" target="_blank" href={cod01}>
  <img class="img" src={cod01} />
 </a>

 <p>
  The project required careful performance optimization to maintain smooth 60fps
  rendering across varying device capabilities, achieved through efficient
  shader optimization, texture atlasing, and selective quality scaling. The
  backend infrastructure on AWS was designed to handle traffic spikes,
  implementing CDN distribution that proved critical when the campaign generated
  over half a million views on launch day. The iterative development approach
  allowed for seamless content updates and feature additions throughout the
  campaign lifecycle, with new interactive elements deployed without requiring
  full site rebuilds.
 </p>
</div>
