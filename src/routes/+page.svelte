<script lang="ts">
  import EncryptedText from "$lib/components/encrypted_text.svelte";
  import ContactForm from "$lib/components/contact_form.svelte";
  import WindowRenderer from "$lib/window/window_renderer.svelte";
  import {
    type WindowDefinition,
    WindowDirector,
  } from "$lib/window/window_director.svelte";
  import Window from "$lib/window/window.svelte";
  import PageHeader from "$lib/components/page_header.svelte";
  import { preloadData } from "$app/navigation";
  import { browser } from "$app/environment";
  import Link from "$lib/components/link.svelte";

  const workItems = [
    {
      title: "call of duty",
      href: "/work/call-of-duty",
      description:
        "interactive marketing experience for Call of Duty: Black Ops 6",
    },
    {
      title: "industry music",
      href: "/work/industry-music",
      description: "custom audio/music marketplace for Industry Music",
    },
    {
      title: "chefs table",
      href: "/work/chefs-table",
      description:
        "custom storefront built with headless Shopify, Sanity, and Remix",
    },
    {
      title: "pepsi dataviz",
      href: "/work/pepsi",
      description:
        "interactive 3d webgl data visualization illustrating how Pepsi visualizes their global operations",
    },
    {
      title: "house of the dragon",
      href: "/work/house-of-the-dragon",
      description: "interactive dragon index microsite for HBO",
    },
    {
      title: "droplab.com",
      href: "/work/droplab",
      description: "showcase site featuring blended html & webgl elements",
    },
    {
      title: "nice.com",
      href: "/work/nice",
      description: "microsite for Nice.com's FluenCX product offering",
    },
  ];

  const projectItems = [
    {
      title: "elysia",
      href: "/projects/elysia",
      description: "webgl game engine for the browser",
    },
    {
      title: "vono",
      href: "/projects/vono",
      description:
        "vite plugin that adds full stack server-side capabilities to client apps",
    },
    {
      title: "blackberry.js",
      href: "/blackberry.html",
      external: true,
      description: "reactive html components for the artisinal web",
    },
    {
      title: "anonmsg.dev",
      href: "https://anonmsg.dev",
      external: true,
      description: "anonymous inbox api",
    },
  ];

  const postItems = [
    // {
    //  title: "augmentation, not agents",
    //  href: "/posts/augmentation-not-agents",
    // },
    {
      title:
        "can we use an entity-component-system architecture for everything?",
      href: "/posts/ecs-for-everything",
      description:
        "what is an ecs, how does it work, and is a solution for everything?",
    },
    {
      title: "solving client-server sync problems",
      href: "/posts/solving-client-server-sync-problems",
      description:
        "using stable mutation ordering and immutable data to solve optimistic updates and client-server sync",
    },
  ];

  if (browser) {
    for (let workItem of workItems) {
      preloadData(workItem.href);
    }
    for (let project of projectItems) {
      preloadData(project.href);
    }
  }
</script>

<div class="home">
  <main>
    <PageHeader
      content="Benton is a software developer specialising in full stack development."
    />

    <section class="home_section_container">
      <h2 class="home_section_title">About Me</h2>
      <p>
        <EncryptedText
          mount
          content="Hiya, welcome to my corner of the web. Here I collect random thoughts, list my active projects, and showcase some of my latest works."
        />
      </p>
      <br />
      <p>
        <EncryptedText
          mount
          content="I'm a full-stack software engineer with ~5 years of experience building web applications with a focus on interactive webgl frontends. Based in Victoria, Canada, I've been passionate about computers since childhood and have had the privilege of working on some incredibly interesting projects."
        />
      </p>
      <br />
      <p>
        <EncryptedText
          mount
          content="Besides programming I like to follow formula one, exercise, read old classics, and travel the world."
        />
      </p>
    </section>

    <!-- <section class="home_section_container">
   <h2 class="home_section_title">Writing</h2>
   <ul class="home_section_list">
    {#each postItems as item}
     <li>
      <a href={item.href}>
       <EncryptedText content={item.title} hover mount />
       {#if item.description}
        <p class="ml-2 text-sm opacity-60">{item.description}</p>
       {/if}
      </a>
     </li>
    {/each}
   </ul>
  </section> -->

    <section class="home_section_container">
      <h2 class="home_section_title">
        Recent Work (<Link external href="https://droplab.com">Droplab</Link>)
      </h2>
      <ul class="home_section_list">
        {#each workItems as item}
          <li>
            <Link href={item.href}>
              <EncryptedText content={item.title} hover mount />
              {#if item.description}
                <p class="ml-2 text-sm opacity-60">{item.description}</p>
              {/if}
            </Link>
          </li>
        {/each}
      </ul>
    </section>

    <section class="home_section_container">
      <h2 class="home_section_title">Recent Work (Personal)</h2>
      <ul class="home_section_list">
        {#each projectItems as item}
          <li>
            <Link href={item.href} external={item.external} underline={false}>
              <EncryptedText content={item.title} hover mount />
            </Link>
            {#if item.description}
              <p class="ml-2 text-sm opacity-60">{item.description}</p>
            {/if}
          </li>
        {/each}
      </ul>
    </section>

    <section class="home_section_container">
      <h2 class="home_section_title">Contact</h2>
      <ContactForm />
    </section>
  </main>
</div>

<style>
  .home {
    display: flex;
  }

  .home_section_container {
    margin-bottom: 3rem;
    max-width: 628px;

    & > p {
      line-height: 125%;
      font-weight: 350;
    }
  }

  .home_section_title {
    font-size: 1.2rem;
    font-weight: 200;
    line-height: 105%;
    max-width: 1024px;
    opacity: 0.5;
    cursor: default;
    @media (prefers-color-scheme: dark) {
      opacity: 0.75;
    }
    margin-bottom: 0.5rem;
  }

  .home_section_list {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin-bottom: 1.5rem;

    & > li {
      margin-bottom: 0.25rem;

      & > a {
        color: inherit;
        text-decoration: none;
        transition: color 0.2s;
      }
    }
  }
</style>
