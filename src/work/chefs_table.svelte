<script lang="ts">
import Link from "$lib/components/link.svelte";
import PageHeader from "$lib/components/page_header.svelte";
import img01 from "./ct01.webp";
import img02 from "./ct02.webp";
import img03 from "./ct03.webp";
</script>

<svelte:head>
 <title>work - chef's table</title>
</svelte:head>

<PageHeader
 content="Project: Chefs Table - Full Stack Storefront for Netflix"
/>

<div class="space-y-12">
 <div class="flex flex-row items-center">
  <Link href="https://chefstable.com/" external>go to site</Link>
 </div>

 <p>
  I took the lead on choosing the technical stack for this Netflix Chef's Table
  e-commerce project, settling on Remix v2 paired with Shopify's Hydrogen
  framework and a custom Sanity CMS build. The decision came after establishing
  a proof of concept that demonstrated how these technologies could work
  together to create a headless commerce experience that matched the premium
  feel of the Chef's Table brand. Remix's server-side rendering capabilities
  combined with Hydrogen's commerce-specific tooling seemed like the right
  foundation for what we were trying to build.
 </p>

 <a class="block" target="_blank" href={img01}>
  <img src={img01} />
 </a>

 <p>
  Working with Hydrogen proved challenging since the framework was still
  relatively new at the time and documentation was sparse. We found ourselves
  digging through source code regularly to understand how core features like
  cart management were supposed to work. I implemented custom data loaders that
  satisfied Hydrogen's interface without overloading the system with unnecessary
  requests. This approach helped us maintain good performance while working
  within the framework's expectations for data fetching patterns.
 </p>

 <a class="block" target="_blank" href={img02}>
  <img src={img02} />
 </a>

 <p>
  The Sanity CMS integration became one of the more complex parts of the
  project. We built a dynamic page builder that allowed the content team to
  create custom layouts without developer intervention, and integrated Sanity
  data directly into our Shopify data structure to keep everything synced. This
  meant designing a flexible schema system that could handle everything from
  product showcases to editorial content while maintaining the connection
  between our CMS and commerce data. The direct integration approach eliminated
  the need for separate sync processes and kept our data consistent.
 </p>

 <a class="block" target="_blank" href={img03}>
  <img src={img03} />
 </a>

 <p>
  The project taught me a lot about working with bleeding-edge technology and
  the trade-offs that come with being an early adopter. While we encountered
  plenty of obstacles along the way, the final result was a fast, flexible
  e-commerce platform that could scale with Netflix's content marketing needs.
  The experience of building with Hydrogen during its early days gave our team
  valuable insights that we've applied to subsequent projects.
 </p>
</div>
