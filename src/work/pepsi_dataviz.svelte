<script lang="ts">
  import Link from "$lib/components/link.svelte";
  import PageHeader from "$lib/components/page_header.svelte";
  import img01 from "./pepsi01.jpg";
  import img02 from "./pepsi02.jpg";
  import img03 from "./pepsi03.jpg";
</script>

<svelte:head>
  <title>work - Pepsi Dataviz</title>
</svelte:head>

<PageHeader content="Project: Pepsi Dataviz - WebGL data visualization" />

<div class="space-y-12">
  <div class="flex flex-row items-center">
    <Link href="https://pepsi-dataviz-demo.vercel.app/" external>view demo</Link
    >
  </div>

  <p>
    I worked on an interactive 3D WebGL data visualization application that
    illustrated how Pepsi visualized their global operations. The system
    featured a dynamic data cloud interface powered by a headless CMS, giving
    content managers complete control over individual data points and the
    relationships between them. What made this project particularly interesting
    was the real-time nature of the connections - we could adjust hierarchies,
    modify data relationships, and update visual elements without touching any
    code.
  </p>

  <a class="block" target="_blank" href={img01}>
    <img src={img01} />
  </a>

  <a class="block" target="_blank" href={img02}>
    <img src={img02} />
  </a>

  <p>
    The technical challenge involved optimizing WebGL performance for large
    datasets while maintaining smooth interactions across various screen sizes
    and hardware configurations. The visualization served as a learning tool.
    Employees could explore different layers of the company's data ecosystem,
    from supply chain metrics to consumer insights, all rendered in an intuitive
    3D environment. We designed the interface to make complex data relationships
    accessible to non-technical users, allowing them to understand how different
    departments and regions interconnected within Pepsi's operations.
  </p>

  <a class="block" target="_blank" href={img03}>
    <img src={img03} />
  </a>
</div>
