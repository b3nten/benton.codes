<script lang="ts">
  import { onMount } from "svelte";
  import { animate } from "motion";

  interface Props {
    content?: string;
    mount?: boolean;
    hover?: boolean;
    duration?: number;
  }

  let {
    content = "",
    mount = false,
    hover = false,
    duration = 0.8,
  }: Props = $props();

  let element: HTMLElement;
  let displayText = $state("");

  const chars = "abcdefghijklmnopqrstuvwxyz";
  const ignores = [
    " ",
    "  ",
    ",",
    " ",
    "\n",
    "\t",
    "\r",
    "\f",
    "\v",
    ",",
    ".",
    "!",
    "?",
    ":",
    ";",
    "'",
    '"',
    "`",
    "~",
    "(",
    ")",
    "[",
    "]",
    "{",
    "}",
    "<",
    ">",
    "|",
    "\\",
    "/",
    "_",
    "-",
    "=",
    "+",
    "*",
    "&",
    "^",
    "%",
    "$",
    "#",
    "@",
    "!",
  ];

  const getRandomChar = () => chars[Math.floor(Math.random() * chars.length)];

  const encrypt = () => {
    let encrypted = "";
    for (let i = 0; i < content.length; i++) {
      if (ignores.includes(content[i])) {
        encrypted += content[i];
      } else {
        encrypted += getRandomChar();
      }
    }
    displayText = encrypted;
  };

  encrypt();

  const decrypt = () => {
    displayText = content;
  };

  const animateText = (animationDuration = duration) => {
    animate(0, 1, {
      duration: animationDuration,
      onUpdate: encrypt,
      onComplete: decrypt,
    });
  };

  const handleHover = () => {
    if (hover) {
      animateText(0.1);
    }
  };

  const handleFocus = () => {
    animateText(0.1);
  };

  onMount(() => {
    // Add window focus listener
    window.addEventListener("focus", handleFocus);

    // Run mount animation if specified
    if (mount) {
      animateText(0.5);
    }

    // Random animation for hover elements
    if (hover) {
      const randomAnimate = () => {
        setTimeout(
          () => {
            if (Math.random() < 0.3) {
              animateText(0.4);
            }
            randomAnimate();
          },
          Math.random() * 3000 + 8000,
        );
      };
      randomAnimate();
    }

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  });
</script>

<span
  bind:this={element}
  onmouseenter={handleHover}
  role="presentation"
  aria-label={content}
>
  {displayText}
</span>

<style>
  span {
    display: inline;
  }
</style>
