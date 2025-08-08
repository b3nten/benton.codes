<script lang="ts">
import Link from "$lib/components/link.svelte";
import PageHeader from "$lib/components/page_header.svelte";
import dl01 from "./dl01.webp";
import dl02 from "./dl02.webp";
import dl03 from "./dl03.webp";
import dl04 from "./dl04.webp";
import dl05 from "./dl05.webp";
</script>

<svelte:head>
 <title>work - droplab.com</title>
</svelte:head>

<PageHeader content="Project: Droplab.com WebGL Agency Site" />

<div class="space-y-12">
 <div class="flex flex-row items-center">
  <Link href="https://droplab.com/" external>go to site</Link>
 </div>

 <p>
  Our team took on the task of building our company website, <a
   href="https://droplab.com/"
   target="_blank"
   class="underline"
  >
   Droplab.com
  </a>
  from the ground up, starting with Next.js and the app directory structure. While
  we were excited to work with the latest React features, we quickly ran into practical
  limitations that impacted the user experience. The app directory's handling of
  page transitions felt clunky, and we struggled with routing inconsistencies and
  data caching issues that made the site feel less responsive than we wanted. These
  technical constraints, combined with performance bottlenecks we were seeing with
  React-Three-Fiber on mobile devices, led us to make the decision to completely
  rewrite the project.
 </p>

 <a class="block" target="_blank" href={dl01}>
  <img class="img" src={dl01} />
 </a>

 <p>
  The migration to SvelteKit turned out to be the right call for our needs. I
  also made the choice to replace React-Three-Fiber with Elysia, the custom
  WebGL engine I'd been developing. This wasn't just a framework swap - it
  required rethinking how we approached rendering and optimization. Elysia's
  automatic mesh batching system proved particularly valuable and having control
  over the render pipeline meant we could fine-tune performance for different
  device capabilities.
 </p>

 <a class="block" target="_blank" href={dl02}>
  <img class="img" src={dl02} />
 </a>

 <p>
  One of the more interesting technical challenges was synchronizing 3D elements
  in the WebGL context with traditional DOM elements. This coordination allows
  for visual effects that wouldn't be possible with standard CSS transforms or
  animations alone. I handled the implementation of this synchronization system,
  and thehe performance improvements were significant - we saw frame rates on
  mobile devices jump from around 30fps to a stable 60fps.
 </p>

 <a class="block" target="_blank" href={dl03}>
  <img class="img" src={dl03} />
 </a>

 <p>
  The visual overhaul also gave us a chance to rewrite our shader code from
  scratch. The new glass material shaders are cleaner and more efficient than
  what we had before, contributing to both the performance gains and the overall
  polish of the final product. The combination of SvelteKit's streamlined
  architecture and Elysia's optimized rendering created a foundation that better
  serves both our development workflow and our users' experience.
 </p>

 <a class="block" target="_blank" href={dl04}>
  <img class="img" src={dl04} />
 </a>
</div>
