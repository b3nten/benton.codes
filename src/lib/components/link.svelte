<script lang="ts">
import type { Snippet } from "svelte";

let props: {
	external?: boolean;
	underline?: boolean;
	href: string;
	children: Snippet;
} = $props();
</script>

<a href={props.href} target={props.external ? "_blank" : undefined}>
  <span
    class:underline={props.underline ||
      (!!props.external && props.underline !== false)}
    >{@render props.children()}</span
  >
  {#if props.external}
    <span class="inline-block translate-y-[-2px] ml-[-.3em]">➚</span>
  {/if}
</a>
