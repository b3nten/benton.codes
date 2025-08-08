<script lang="ts">
import { slide } from "svelte/transition";
import EncryptedText from "./encrypted_text.svelte";
import Link from "./link.svelte";

let { showHome = true, vertical = false } = $props();
</script>

<ul class="flex space-x-3 opacity-50" class:flex-col={vertical}>
  {#if showHome}
    <li>
      <Link href="/" underline>
        <EncryptedText content="home" hover mount />
      </Link>
    </li>
  {/if}
  <li>
    <Link href="https://github.com/b3nten" external>
      <EncryptedText content="github" hover mount />
    </Link>
  </li>
  <li>
    <Link href="https://www.artstation.com/benten28" external>
      <EncryptedText content="artstation" hover mount />
    </Link>
  </li>
</ul>

<style>
  a {
    display: block;
    position: relative;
    color: inherit;
    text-decoration: none;
    transition: color 0.2s;
    text-decoration: underline;
  }
</style>
