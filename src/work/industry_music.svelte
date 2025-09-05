<script lang="ts">
  import PageHeader from "$lib/components/page_header.svelte";
  import { fade } from "svelte/transition";
  import img01 from "./im01.webp";
  import img02 from "./im02.webp";
  import img03 from "./im03.webp";
  import Link from "$lib/components/link.svelte";
</script>

<svelte:head>
  <title>work - industry music</title>
</svelte:head>

<PageHeader content="Project: Industry Music - Online Audio Marketplace" />

<div class="space-y-12">
  <div class="flex flex-row items-center">
    <Link href="https://industrymusic.com/" external>go to site</Link>
  </div>

  <p>
    I worked on a custom audio/music marketplace for Industry Music, building a
    comprehensive platform from the ground up. The project centered around a
    micro-services architecture paired with a custom CMS layer, creating a
    seamless experience for both content creators and end users. We designed the
    system to handle the complex needs of music distribution while maintaining
    scalability and performance.
  </p>

  <a class="block" target="_blank" href={img01}>
    <img src={img01} />
  </a>
  <p>
    The technical foundation combined Vercel for front-end deployment with AWS
    services powering the backend infrastructure. Our serverless audio
    processing pipeline became one of the project's most important features,
    enabling users to download large playlists efficiently through chunked
    delivery at multiple quality levels and format options. This approach solved
    the challenge of handling varied user preferences while managing bandwidth
    constraints and server resources effectively.
  </p>
  <a class="block" target="_blank" href={img02}>
    <img src={img02} />
  </a>
  <p>
    My primary focus involved modernizing the existing codebase and addressing
    accumulated technical debt that had been slowing development velocity.
    Through careful optimization work, I managed to reduce the bundle size by
    approximately 50%, which translated to noticeably faster load times and
    improved user experience. The performance improvements extended beyond
    simple file size reduction; I restructured components, eliminated redundant
    dependencies, streamlined the build process, and introduced static typing
    via TypeScript.
  </p>
  <a class="block" target="_blank" href={img03}>
    <img src={img03} />
  </a>
  <p>
    Beyond performance optimization, I dedicated significant effort to improving
    accessibility compliance and resolving long-standing bugs that had been
    affecting user workflows. We also built a custom CMS that empowered
    non-technical team members to manage content independently, reducing
    bottlenecks in the content publication process. The end result was a
    maintainable, performant platform that served both the business needs and
    user expectations of a modern music marketplace.
  </p>
</div>
