<script lang="ts">
  import { onMount } from "svelte";

  let canvas: HTMLCanvasElement = $state(null!);

  onMount(() => {
    let isDarkMode =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    let onChange = (e: MediaQueryListEvent) => {
      isDarkMode = e.matches;
    };

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", onChange);

    let GRID_SIZE = 75,
      BG_COLOR = () =>
        isDarkMode ? "rgba(0, 0, 0, 1)" : "rgba(245, 245, 245, 1)",
      BG_FILL_COLOR = () =>
        isDarkMode ? "rgba(0, 0, 0, 0.2)" : "rgba(245, 245, 245, .25)",
      FG_STROKE_COLOR = () =>
        isDarkMode ? "rgba(60, 60, 60, 1)" : "rgba(230, 230, 230, 1)",
      FG_FILL_COLOR = () =>
        isDarkMode ? "rgba(22, 22, 22, 1)" : "rgba(240, 240, 240, 1)",
      NEIGHBOR_STROKE_COLOR = () =>
        isDarkMode ? "rgba(50, 50, 50, .75)" : "rgba(242, 242, 242, 1)",
      ctx = canvas.getContext("2d")!,
      mouseX = 0,
      mouseY = 0,
      idle = false,
      lastSquare = null,
      lastFillUpdate = performance.now(),
      hasResized = false,
      quit = false;

    window.addEventListener("resize", () => {
      hasResized = true;
    });

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      idle = false;
      requestAnimationFrame(() => (idle = true));
    });

    let updateCanvas = () => {
      if (quit) return;
      requestAnimationFrame(updateCanvas);

      if (hasResized) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        hasResized = false;
      }

      let rowCount = Math.floor(window.innerHeight / GRID_SIZE);
      let numCount = Math.floor(window.innerWidth / GRID_SIZE);

      if (performance.now() - lastFillUpdate > 50) {
        ctx.fillStyle = BG_FILL_COLOR();
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        lastFillUpdate = performance.now();
      }

      for (let x = 0; x < numCount; x++) {
        for (let y = 0; y < rowCount; y++) {
          if (
            mouseX > x * GRID_SIZE &&
            mouseX < x * GRID_SIZE + GRID_SIZE &&
            mouseY > y * GRID_SIZE &&
            mouseY < y * GRID_SIZE + GRID_SIZE &&
            !idle
          ) {
            ctx.strokeStyle = FG_STROKE_COLOR();
            ctx.strokeRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
            ctx.fillStyle = FG_FILL_COLOR();
            ctx.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);

            if (lastSquare?.[0] !== x || lastSquare?.[1] !== y) {
              let neighbors = [
                [x - 1, y],
                [x + 1, y],
                [x, y - 1],
                [x, y + 1],
                [x - 1, y - 1],
                [x + 1, y + 1],
                [x - 1, y + 1],
                [x + 1, y - 1],
              ];
              for (let n in neighbors) {
                if (Math.random() < 0.4) {
                  ctx.strokeStyle = NEIGHBOR_STROKE_COLOR();
                  ctx.strokeRect(
                    neighbors[n][0] * GRID_SIZE,
                    neighbors[n][1] * GRID_SIZE,
                    GRID_SIZE,
                    GRID_SIZE,
                  );
                }
              }
              lastSquare = [x, y];
            }
          }
        }
      }
    };

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.fillStyle = BG_COLOR();
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    updateCanvas();

    return () => {
      quit = true;
    };
  });
</script>

<canvas bind:this={canvas}></canvas>

<style>
  canvas {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: -1;
    pointer-events: none;
    padding: 0;
    margin: 0;
  }
</style>
