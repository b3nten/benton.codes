import { Ivysaur } from "blackberry.js";
import "./window.tsx"

export class AWindow extends Ivysaur {
    static light_dom = true;

    link_element?: HTMLAnchorElement;

    window_element?: HTMLElement;

    @attribute("min-window-size") get min_size() {
        return 768
    }

    on_mount = () => {
        this.link_element = this.querySelector("a")
        this.link_element?.addEventListener("click", this.on_click)
    }

    on_click = (e: MouseEvent) => {
        if(window.innerWidth < this.min_size) {
            return;
        }
        e.preventDefault();
        const url = this.link_element?.href;

        let container = document.getElementById("window-container");

        let window_el = document.createElement("window-element");

        window_el.innerHTML = `
            <div style="background-color: blue; padding: 2px;" slot="title-bar">
                <button style="background-color: red;">close</button>
                <span>Window Title</span>
            </div>
            <div slot="content" style="background-color: #0c0c0c; width: 100%; height: 100%;">
                <iframe src="https://rauchg.com/" style="width: 100%; height: 100%;"></iframe>
            </div>
        `

        container?.appendChild(window_el);
    }

    on_unmount = () => {
        this.link_element?.removeEventListener("click", this.on_click)
    }
}

AWindow.define_self("a-window")