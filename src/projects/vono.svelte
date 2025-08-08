<script lang="ts">
import Link from "$lib/components/link.svelte";
import PageHeader from "$lib/components/page_header.svelte";
</script>

<svelte:head>
  <title>projects - vono</title>
</svelte:head>

<PageHeader content="Vono - server plugin for Vite" />

<div class="space-y-12">
  <div class="flex flex-row items-center">
    <Link href="https://github.com/vonojs/vite" external>github</Link>
  </div>

  <p>
    Vono is a server plugin for Vite that allows developers to add server-side
    capabilities to their Vite apps and build for multiple platforms. I built
    Vono because I wanted a minimal platform for experimenting with building
    full stack applications without needing to use a metaframwork like Next.js.
  </p>

  <p>
    Vono represents a focused approach to adding server-side capabilities to
    Vite applications without imposing framework constraints. The plugin
    operates by creating a separate Vite environment for server-side code while
    maintaining independence from the client-side build process. This
    architecture allows developers to integrate server functionality into
    existing applications without modifying their current setup.
  </p>

  <p>
    The core abstraction centers around a simple Request-Response interface,
    where the server entry point exports either a default function accepting a
    Request object or an object with a fetch method following the same
    signature. This design choice aligns with modern web standards and provides
    a familiar interface for developers working with platforms like Cloudflare
    Workers.
  </p>

  <p>
    Enabled by the Request-Response interface,the adaptor system handles the
    complexity of deploying to different platforms while keeping the core server
    logic unchanged. Each adaptor transforms the built server code into the
    format expected by its target platform - whether that's a standalone Node.js
    server, a Cloudflare Worker, or a Netlify function. This abstraction means
    the same server code can run across multiple deployment targets without
    modification, though each adaptor may require platform-specific
    configuration files.
  </p>
  <p>
    Vono includes features like access to Vite's transformed HTML through a
    virtual import (#vono/html) and the build manifest (#vono/manifest), which
    is useful for server-side rendering scenarios where you need to inject the
    correct asset paths or preload links.
  </p>
</div>
