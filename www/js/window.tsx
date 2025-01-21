import {css, h} from "blackberry.js"

class DragController {
    constructor(
        private container: HTMLElement,
        private handle: HTMLElement,
        x, y
    ) {
        this.handle.addEventListener("mousedown", this.on_drag_start)
        window.addEventListener("resize", this.on_window_resize)

        this.x = x
        this.y = y
        this.start = {x, y}
        this.last = {x, y}
        this.offset = {x: 0, y: 0}
    };

    mouse_down = false;
    dragging = false;

    start = {x: 0, y: 0};
    offset = {x: 0, y: 0};
    last = {x: 0, y: 0};

    x = 0;
    y = 0;

    protected on_drag_start = (e: MouseEvent) => {
        this.mouse_down = true;

        this.offset = {
            x: e.clientX - this.x,
            y: e.clientY - this.y,
        };

        this.start = {
            x: e.clientX - this.offset.x,
            y: e.clientY - this.offset.y,
        };

        window.addEventListener("mousemove", this.on_drag_move);
        window.addEventListener("mouseup", this.on_drag_end);
        this.handle.style.cursor = "move"
    };

    protected on_drag_move = (e: MouseEvent) => {
        if (!this.mouse_down) return;

        if (!this.dragging) {
            this.dragging = true;
        }

        // want to constrain the parent bounds to the window
        const bounds = this.container.getBoundingClientRect();

        const x = Math.max(
            0,
            Math.min(e.clientX - this.offset.x, window.innerWidth - bounds.width),
        );
        const y = Math.max(
            0,
            Math.min(e.clientY - this.offset.y, window.innerHeight - bounds.height),
        );

        this.x = x;
        this.y = y;

        this.last = {x, y};

        this.container.style.transform = `translate(${this.x}px, ${this.y}px)`;
    };

    protected on_drag_end = () => {
        this.dragging = false;
        this.mouse_down = false;
        this.handle.style.cursor = "default"
        window.removeEventListener("mousemove", this.on_drag_move);
        window.removeEventListener("mouseup", this.on_drag_end);
    };

    protected on_window_resize = () => {
        const bounds = this.container.getBoundingClientRect();

        const x = Math.max(
            0,
            Math.min(this.last.x, window.innerWidth - bounds.width),
        );
        const y = Math.max(
            0,
            Math.min(this.last.y, window.innerHeight - bounds.height),
        );

        this.x = x;
        this.y = y;

        this.container.style.transform = `translate(${this.x}px, ${this.y}px)`;
    }

    get_transform_translate_coords = () => {
        const style = window.getComputedStyle(this.container);
        const matrix = style.transform.match(/^matrix\((.+)\)$/);
        if (matrix) {
            const coords = matrix[1].split(", ");
            return {
                x: parseInt(coords[4]),
                y: parseInt(coords[5]),
            };
        }
        return {x: 0, y: 0};
    }
}

enum ResizeHandles {
    TopLeft = "rh-top-left",
    TopRight = "rh-top-right",
    BottomLeft = "rh-bottom-left",
    BottomRight = "rh-bottom-right",
    Top = "rh-top",
    Bottom = "rh-bottom",
    Left = "rh-left",
    Right = "rh-right",
}

export class Window extends Component {
    static styles = css`
    :host {
      box-sizing: border-box;
      margin: 0;
      display: block;
      position: fixed;
      top: 0px;
      left: 0px;
      overflow: hidden;
    }

    #title-bar {
        cursor: default;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    #content-wrapper {
      width: 100%;
      height: 100%;
    }

    #${ResizeHandles.BottomLeft} {
        position: absolute;
        bottom: -4px;
        left: -4px;
        width: 8px;
        height: 8px;
        &:hover {
            cursor: nesw-resize;
        }
    }

    #${ResizeHandles.BottomRight} {
        position: absolute;
        bottom: -4px;
        right: -4px;
        width: 8px;
        height: 8px;
        &:hover {
            cursor: nwse-resize;
        }
    }

    #${ResizeHandles.TopLeft} {
        position: absolute;
        top: -4px;
        left: -4px;
        width: 8px;
        height: 8px;
        &:hover {
            cursor: nwse-resize;
        }
    }

    #${ResizeHandles.TopRight} {
        position: absolute;
        top: -4px;
        right: -4px;
        width: 8px;
        height: 8px;
        &:hover {
            cursor: nesw-resize;
        }
    }

    #${ResizeHandles.Left} {
        position: absolute;
        top: 4px;
        left: -4px;
        width: 8px;
        height: calc(100% - 8px);
        &:hover {
            cursor: ew-resize;
        }
    }

    #${ResizeHandles.Right} {
        position: absolute;
        top: 4px;
        right: -4px;
        width: 8px;
        height: calc(100% - 8px);
        /* background-color: orange;
        opacity: .25; */
        &:hover {
            cursor: ew-resize;
        }
    }

    #${ResizeHandles.Top} {
        position: absolute;
        top: -4px;
        left: 4px;
        width: calc(100% - 8px);
        height: 8px;
        &:hover {
            cursor: ns-resize;
        }
    }

    #${ResizeHandles.Bottom} {
        position: absolute;
        bottom: -4px;
        left: 4px;
        width: calc(100% - 8px);
        height: 8px;
        &:hover {
            cursor: ns-resize;
        }
    }
  `

    @attribute("window-width") accessor window_width = "500px"
    @attribute("window-height") accessor window_height = "500px"

    @attribute("min-width") get min_width() {
        return "200px"
    }

    @attribute("min-height") get min_height() {
        return "200px"
    }

    @state() accessor content_ref = {value: null}
    @state() accessor title_bar_ref = {value: null}
    @state() accessor title_bar_height = 0;

    title_bar_resizer: ResizeObserver | null = null;

    on_mounted = () => {
        let x = window.innerWidth / 2 - parseInt(this.window_width) / 2;
        let y = window.innerHeight / 2 - parseInt(this.window_height) / 2;
        this.style.transform = `translate(${x}px, ${y}px)`;

        new DragController(
            this,
            this.title_bar_ref.value,
            x, y
        )

        effect(() => {
            this.style.width = this.window_width;
            this.style.height = this.window_height;
        })

        this.title_bar_height = this.title_bar_ref.value.clientHeight;
        this.title_bar_resizer = new ResizeObserver(() => {
            this.title_bar_height = this.title_bar_ref.value.clientHeight;
        })
        this.title_bar_resizer.observe(this.title_bar_ref.value)
    }

    on_unmount(): void {
        this.title_bar_resizer?.disconnect()
    }

    active_resize_handle: ResizeHandles | null = null;

    get_transform_translate_coords = () => {
        const style = window.getComputedStyle(this);
        const matrix = style.transform.match(/^matrix\((.+)\)$/);
        if (matrix) {
            const coords = matrix[1].split(", ");
            return {
                x: parseInt(coords[4]),
                y: parseInt(coords[5]),
            };
        }
        return {x: 0, y: 0};
    }

    set_window_size = (width: number | undefined, height: number | undefined) => {
        if (width) this.window_width = `${width}px`
        if (height) this.window_height = `${height}px`
    }

    resize_vars = {
        prev_position: {x: 0, y: 0},
    }

    on_resize_down = (e: MouseEvent) => {
        this.active_resize_handle = (e.target as HTMLElement).id as ResizeHandles;
        this.style.userSelect = "none";

        window.addEventListener("mousemove", this.on_resize_move);
        window.addEventListener("mouseup", this.on_resize_up);

        this.resize_vars.prev_position = {
            x: e.clientX,
            y: e.clientY,
        };
    }

    on_resize_move = (e) => {

        let resize_x = (e, dir) => {
            let x = (e.clientX - this.resize_vars.prev_position.x) * dir;
            let newPos = parseInt(this.window_width) + x;
            if (
                newPos < parseInt(this.min_width)
                || e.clientX > window.innerWidth
                || e.clientX < 0
            ) {
                return;
            }
            this.set_window_size(parseInt(this.window_width) + x, undefined);
            this.resize_vars.prev_position.x = e.clientX;
            if (dir < 0) {
                let transform = this.get_transform_translate_coords();
                this.style.transform = `translate(${transform.x - x}px, ${transform.y}px)`;
            }
        }

        let resize_y = (e, dir) => {
            let y = (e.clientY - this.resize_vars.prev_position.y) * dir;
            let newPos = parseInt(this.window_height) + y;
            if (
                newPos < parseInt(this.min_height)
                || e.clientY > window.innerHeight
                || e.clientY < 0
            ) {
                return;
            }
            this.set_window_size(undefined, parseInt(this.window_height) + y);
            this.resize_vars.prev_position.y = e.clientY;
            if (dir < 0) {
                let transform = this.get_transform_translate_coords();
                this.style.transform = `translate(${transform.x}px, ${transform.y - y}px)`;
            }
        }

        switch (this.active_resize_handle) {
            case ResizeHandles.Top: {
                resize_y(e, -1)
                break;
            }
            case ResizeHandles.TopLeft: {
                resize_x(e, -1)
                resize_y(e, -1)
                break;
            }
            case ResizeHandles.TopRight: {
                resize_x(e, 1)
                resize_y(e, -1)
                break;
            }
            case ResizeHandles.Bottom: {
                resize_y(e, 1)
                break;
            }
            case ResizeHandles.BottomLeft: {
                resize_x(e, -1)
                resize_y(e, 1)
                break;
            }
            case ResizeHandles.BottomRight: {
                resize_x(e, 1)
                resize_y(e, 1)
                break;
            }
            case ResizeHandles.Left: {
                resize_x(e, -1)
                break;
            }
            case ResizeHandles.Right: {
                resize_x(e, 1)
                break;
            }
        }
    }

    on_resize_up = () => {
        this.active_resize_handle = null;
        this.style.userSelect = "auto";
        window.removeEventListener("mousemove", this.on_resize_move);
        window.removeEventListener("mouseup", this.on_resize_up);
    }

    close = () => {
        this.remove()
    }

    override render = () => {
        return (
            <host>

                <div
                    id="title-bar"
                    ref={this.title_bar_ref}
                >
                    <slot name="title-bar"/>
                </div>

                <div
                    id="content-wrapper"
                    ref={this.content_ref}
                    style={`height: calc(100% - ${this.title_bar_height}px)`}
                >
                    <slot name="content"/>
                </div>

                <div onmousedown={this.on_resize_down} id={ResizeHandles.Bottom}/>
                <div onmousedown={this.on_resize_down} id={ResizeHandles.Top}/>
                <div onmousedown={this.on_resize_down} id={ResizeHandles.Left}/>
                <div onmousedown={this.on_resize_down} id={ResizeHandles.Right}/>
                <div onmousedown={this.on_resize_down} id={ResizeHandles.BottomLeft}/>
                <div onmousedown={this.on_resize_down} id={ResizeHandles.BottomRight}/>
                <div onmousedown={this.on_resize_down} id={ResizeHandles.TopLeft}/>
                <div onmousedown={this.on_resize_down} id={ResizeHandles.TopRight}/>

            </host>
        )
    }
}

Window.define_self("window-element")
