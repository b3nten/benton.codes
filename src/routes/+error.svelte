<script lang="ts">
 import PageHeader from "$lib/components/page_header.svelte";

 import { page } from "$app/state";
</script>

<svelte:head>
 <title>benton.codes</title>
 <meta name="description" content="benton.codes - error" />
</svelte:head>

<main class="space-y-12">
 <PageHeader
  content={page.status === 404
   ? "Whoops, the page you're looking for doesn't exist."
   : "Something went wrong. Sorry bout that."}
 />
 <blockquote class="font-serif text-2xl opacity-60">
  "Error is boundless.
  <br />
  Nor hope nor doubt,
  <br />
  Though both be groundless,
  <br />
  Will average out."
  <br />
  <br />
  <span class="opacity-70">
   By J.V. Cunninhham, from "Meditation on Statistical Method"
  </span>
 </blockquote>
 <p class="underline">
  <a href="/">Go back home</a>
 </p>
</main>
