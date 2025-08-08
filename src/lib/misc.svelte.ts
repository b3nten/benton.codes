import { onMount } from "svelte";

export let is_mounted = () => {
  let mounted = $state(false);
  onMount(() => void (mounted = true));
  return {
    get value() {
      return mounted;
    },
  };
};
