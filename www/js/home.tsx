import { Ivysaur, css, h, Fragment, attribute, state } from "blackberry.js";
import "./components/window.js";

export class HomeWindowButton extends Ivysaur {
  static light_dom = true;

  @attribute("window-title") get title() {
    return "window";
  }

  @attribute("min-window-size") get min_size() {
    return 768;
  }

  get_content = () => {
    let button = this.querySelector("button");
    button?.addEventListener("click", this.on_click);
  };

  on_unmounted = () => {
    let button = this.querySelector("button");
    button?.removeEventListener("click", this.on_click);
  };

  on_click = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
}

export class HomeLinkToWindow extends Ivysaur {
  static light_dom = true;

  link_element?: HTMLAnchorElement;

  @attribute("window-title") get title() {
    return "window";
  }

  @attribute("min-window-size") get min_size() {
    return 768;
  }

  contentPromise: Promise<string> | undefined = undefined;

  on_mount = () => {
    this.link_element = this.querySelector("a");
    this.link_element?.addEventListener("mousedown", this.on_mouse_down);
    this.link_element?.addEventListener("click", this.on_click);
    this.contentPromise = this.fetch_content(this.link_element?.href!);
  };

  fetch_content = async (url: string) => {
    const response = await fetch(url, {
      headers: {
        "X-Fragment": "true",
      },
    });
    const text = await response.text();
    return text;
  };

  on_mouse_down = (e: MouseEvent) => {
    if (window.innerWidth < this.min_size || "ontouchstart" in window) {
      return;
    }

    e.preventDefault();
    let container = document.getElementById("window-container");
    let window_el = document.createElement("window-element");

    let title_e = document.createElement("home-window-title");
    title_e.title = this.title;
    (title_e as HomeWindowTitle).link = this.link_element?.href!;

    window_el.appendChild(title_e);

    window_el.appendChild(document.createElement("home-window-content"));

    window_el.setAttribute("window-width", "760");
    window_el.setAttribute("window-height", "480");

    container?.appendChild(window_el);

    this.contentPromise.then((h) => {
      window_el.querySelector("[slot=content]").innerHTML = h;
    });
  };

  on_click = (e: MouseEvent) => {
    if (window.innerWidth > this.min_size && !("ontouchstart" in window)) {
      e.preventDefault();
    }
  };

  on_unmount = () => {
    this.link_element?.removeEventListener("mousedown", this.on_mouse_down);
    this.link_element?.removeEventListener("click", this.on_click);
  };
}

HomeLinkToWindow.define_self("home-window-link");

export class HomeWindowContent extends Ivysaur {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      background-color: var(--bg-color);
      overflow: scroll;
      filter: var(--focused, brightness(100%))
        var(--unfocused, brightness(60%) saturate(50%));
      border-right: 1px solid #888 !important;
      border-left: 1px solid #888 !important;
      border-bottom: 1px solid #888 !important;
      border-radius: 0 0 8px 8px;
      overflow: scroll;
    }

    :slotted(*) {
      opacity: var(--focused, 1) var(--unfocused, 0.5);
    }
  `;

  render() {
    return (
      <host slot="content">
        <slot></slot>
      </host>
    );
  }
}

HomeWindowContent.define_self("home-window-content");

export class HomeWindowTitle extends Ivysaur {
  static styles = css`
      :host {
          border: 1px solid #888 !important;
          background-color: black/70%
          color: var(--text-color);
          height: 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: 8px 8px 0 0;
          backdrop-filter: blur(20px);
          filter: var(--focused, brightness(100%)) var(--unfocused, brightness(50%));
      }

      .title-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2px 6px;
      }

      .link-btn {
          color: var(--text-color);
          text-decoration: none;
          padding: 4px;
          margin: 4px;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
      }

      .close-btn {
          color: var(--text-color);
          padding: 4px;
          margin: 0 8px;
          cursor: pointer;
          width: 24px;
          height: 24px;
          border: 0px solid transparent;
          font-weight: bold;
          font-size: 1em;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: transparent;
          line-height: 0;
      }
	`;

  @state() accessor title = "window";

  @state() accessor link = "/";

  on_close = () => {
    this.closest("window-element")?.remove();
  };

  render() {
    return (
      <host slot="title-bar">
        <div class="title-container">
          <span>{this.title}</span>
          <a
            class="link-btn"
            href={this.link}
            onmousedown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            ↗
          </a>
        </div>
        <button
          class="close-btn"
          onclick={this.on_close}
          onmousedown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          ⓧ
        </button>
      </host>
    );
  }
}

HomeWindowTitle.define_self("home-window-title");

{
  let isDarkMode =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      isDarkMode = e.matches;
    });

  let GRID_SIZE = 75,
    BG_COLOR = () =>
      isDarkMode ? "rgba(0, 0, 0, 1)" : "rgba(255, 255, 255, 1)",
    BG_FILL_COLOR = () =>
      isDarkMode ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, .25)",
    FG_STROKE_COLOR = () =>
      isDarkMode ? "rgba(60, 60, 60, 1)" : "rgba(240, 240, 240, 1)",
    FG_FILL_COLOR = () =>
      isDarkMode ? "rgba(22, 22, 22, 1)" : "rgba(248, 248, 248, 1)",
    NEIGHBOR_STROKE_COLOR = () =>
      isDarkMode ? "rgba(50, 50, 50, .75)" : "rgba(245, 245, 245, 1)",
    canvas = document.createElement("canvas"),
    ctx = canvas.getContext("2d"),
    mouseX = 0,
    mouseY = 0,
    idle = false,
    lastSquare = null,
    lastFillUpdate = performance.now();

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    idle = false;
    requestAnimationFrame(() => (idle = true));
  });

  let updateCanvas = () => {
    requestAnimationFrame(updateCanvas);

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
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.zIndex = "-1";
  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;
  document.body.appendChild(canvas);
  ctx.fillStyle = BG_COLOR();
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  updateCanvas();
}
