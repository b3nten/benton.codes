<script lang="ts">
  import { navigating } from "$app/state";
  import { untrack } from "svelte";

  let progress = $state(0);
  let show = $state(false);
  let kill_anim: Function;

  let animate = (args: {
    target: number;
    duration: number;
    on_complete?: () => void;
    tween_fn?: (t: number) => number;
  }) => {
    let active = true,
      elapsed = 0,
      last_frame = performance.now(),
      starting_value = progress,
      tween_fn = args.tween_fn || ((t) => t);

    let update = (t: number) => {
      if (!active) return;
      elapsed += t - last_frame;
      last_frame = t;
      if (elapsed >= args.duration) {
        progress = args.target;
        active = false;
        return void args.on_complete?.();
      }
      let tweenProgress = tween_fn(Math.min(1, elapsed / args.duration));
      progress =
        starting_value + (args.target - starting_value) * tweenProgress;
      requestAnimationFrame(update);
    };

    requestAnimationFrame(update);

    return () => void (active = false);
  };

  $effect(() => {
    navigating.to; // only track this;

    untrack(() => {
      if (navigating.to && typeof navigating.delta === "undefined") {
        kill_anim?.();
        show = true;
        progress = 0;
        kill_anim = animate({
          target: 50,
          duration: 700,
          on_complete: () => {
            kill_anim = animate({
              target: 80,
              duration: 1400,
              on_complete: () => {
                kill_anim = animate({
                  target: 90,
                  duration: 3000,
                });
              },
            });
          },
        });
      } else {
        if (kill_anim) {
          kill_anim();
          kill_anim = animate({
            target: 100,
            duration: 250,
            on_complete: () => {
              show = false;
            },
          });
        }
      }
    });
  });
</script>

<div
  class="progress"
  style={`--progress: ${progress}%; --opacity: ${show ? "100%" : "0%"};`}
></div>

<style>
  .progress {
    pointer-events: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    transform-origin: left;
    transform: scale(var(--progress), 1);
    background-color: var(--color-fg);
    transition: opacity width 0.3s ease-in-out;
    opacity: var(--opacity);
  }
</style>
