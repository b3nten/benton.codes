<script lang="ts">
import EncryptedText from "./encrypted_text.svelte";

let { content } = $props();
</script>

<h1>
  <EncryptedText {content} mount hover />
</h1>

<style>
  h1 {
    font-family: "OverpassMono", monospace;
    opacity: 0.35;
    @media (prefers-color-scheme: dark) {
      opacity: 0.55;
    }
    font-size: clamp(1.5rem, 0.5385rem + 3.8462vw, 3rem);
    font-weight: 100;
    letter-spacing: 0.1em;
    line-height: 115%;
    margin: 0 0 2rem;
    max-width: 1024px;
    cursor: default;
  }
</style>
