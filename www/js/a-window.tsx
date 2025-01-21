import { Ivysaur, css, h, Fragment} from "blackberry.js";
import "./window.js"

export class AWindow extends Ivysaur {
  static light_dom = true;

  link_element?: HTMLAnchorElement;

  window_element?: HTMLElement;

  @attribute("min-window-size") get min_size() {
    return 768
  }

  contentPromise: Promise<string> | undefined = undefined;

  on_mount = () => {
    this.link_element = this.querySelector("a")
    this.link_element?.addEventListener("click", this.on_click)
    this.contentPromise = this.fetch_content(this.link_element?.href!);
  }

  fetch_content = async (url: string) => {
    const response = await fetch(url, {
      headers: {
        "X-Fragment": "true"
      }
    });
    const text = await response.text();
    return text;
  }

  on_click = (e: MouseEvent) => {
    if (window.innerWidth < this.min_size) {
      return;
    }

    e.preventDefault();
    let container = document.getElementById("window-container");
    let window_el = document.createElement("window-element");

    let title_e = document.createElement("a-window-title");
    title_e.title = this.link_element?.innerText!;
    (title_e as AWindowTitle).link = this.link_element?.href!;

    let content_e = document.createElement("div");
    content_e.style.borderRight = "1px solid white";
    content_e.style.borderLeft = "1px solid white";
    content_e.style.borderBottom = "1px solid white";
    content_e.style.backgroundColor = "#0c0c0c";
    content_e.style.borderRadius = "0 0 8px 8px";
    content_e.style.width = "100%";
    content_e.style.height = "100%";
    content_e.slot = "content";

    window_el.appendChild(title_e);
    window_el.appendChild(content_e);
    window_el.setAttribute("window-width", "700px")

    container?.appendChild(window_el);

    this.contentPromise.then((h) => {
      window_el.querySelector("[slot=content]").innerHTML = h;
    })
  }

  on_unmount = () => {
    this.link_element?.removeEventListener("click", this.on_click)
  }
}

AWindow.define_self("a-window")


export class AWindowTitle extends Ivysaur {
  static styles = css`
      :host {
        border: 1px solid white !important;
        background-color: #0c0c0c;
        padding: 2px;
        height: 32px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 8px 8px 0 0;
      }

      .title-container {
          display: flex;
            justify-content: center;
            align-items: center;
      }

      .link-btn {
        color: white;
        text-decoration: none;
        padding: 4px;
        margin: 4px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .close-btn {
        color: white;
        padding: 4px;
        margin: 4px;
        cursor: pointer;
        width: 24px;
        height: 24px;
        border: 0px solid transparent;
        font-weight: bold;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: transparent;
      }
    `

  @state() accessor title = "window"

  @state() accessor link = "/"

  on_close = () => {
    this.closest("window-element")?.remove();
  }

  render() {
    return (
      <host slot="title-bar">
        <div class='title-container'>
          <span>{this.title}</span>
          <a
            class="link-btn" href={this.link}
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
          x
        </button>
      </host>
    )
  }
}

AWindowTitle.define_self("a-window-title")
