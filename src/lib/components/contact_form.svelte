<script lang="ts">
import { env } from "$env/dynamic/public";
import { fade } from "svelte/transition";

let name = $state(""),
	email = $state(""),
	content = $state(""),
	error = $state(""),
	pending = $state(false),
	success = $state(false);

let handleSubmit = async (event: Event) => {
	event.preventDefault();
	if (pending) return;
	if (!name || !email || !content) {
		let errorString = "";
		if (!name) errorString += "name is required. ";
		if (!email) errorString += "email is required. ";
		if (!content) errorString += "content is required.";
		error = errorString;
		return;
	}

	error = "";
	pending = true;

	let response = await fetch(
		`https://api.anonmsg.dev/v1/send/${env.PUBLIC_INBOX_KEY}`,
		{
			method: "POST",
			headers: {
				"content-type": "application/json",
			},
			body: JSON.stringify({
				name,
				email,
				content,
			}),
		},
	);

	if (response.ok) {
		success = true;
	} else {
		error = "network failed";
	}
	pending = false;
};
</script>

<form
  onsubmit={handleSubmit}
  class="font-mono"
  class:disabled={success || pending}
>
  <input type="text" placeholder="name" bind:value={name} />
  <input type="email" placeholder="email" bind:value={email} />
  <textarea placeholder="content" bind:value={content}></textarea>
  <input type="submit" value="send" />
  <div class="relative">
    {#if error}
      <p transition:fade class="absolute text-red-400">{error}</p>
    {/if}
    {#if pending}
      <p transition:fade class="absolute">sending...</p>
    {/if}
    {#if success}
      <p transition:fade class="absolute text-green-400">message sent!</p>
    {/if}
  </div>
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    max-width: 400px;
  }
  input,
  textarea {
    color: var(--color-fg);
    display: block;
    margin-bottom: 10px;
    padding: 10px;
    font-size: 16px;
    background-color: color-mix(in hsl, var(--color-bg), transparent 30%);
    filter: backdrop-blur(15px);
    border: 1px solid color-mix(in hsl, var(--color-fg), transparent 70%);
    border-radius: 2px;
  }
  input::placeholder,
  textarea::placeholder {
    font-family: OverpassMono, monospace;
  }
  input:focus,
  textarea:focus {
    outline: none;
    border-color: color-mix(in hsl, var(--color-fg), transparent 10%);
    color: var(--text-color);
  }
  input:focus::placeholder,
  textarea:focus::placeholder {
    color: color-mix(in hsl, var(--color-fg), transparent 30%);
  }
  .disabled input,
  .disabled textarea {
    opacity: 0.7;
    pointer-events: none;
  }
</style>
