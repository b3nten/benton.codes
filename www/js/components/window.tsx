import {attribute, css, effect, h, Ivysaur, state} from "blackberry.js"

const HANDLE_SIZE = 14;

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

export class Window extends Ivysaur {
	static styles = css`
      :host {
          box-sizing: border-box;
          margin: 0;
          display: block;
          position: fixed;
          top: 0px;
          left: 0px;
      }

      #title-bar {
          cursor: default;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          overflow: hidden;
      }

      #content-wrapper {
          width: 100%;
          height: 100%;
          overflow: hidden;
      }

      #${ResizeHandles.BottomLeft} {
          position: absolute;
          bottom: -${HANDLE_SIZE / 2}px;
          left: -${HANDLE_SIZE / 2}px;
          width: ${HANDLE_SIZE}px;
          height: ${HANDLE_SIZE}px;

          &:hover {
              cursor: nesw-resize;
          }
      }

      #${ResizeHandles.BottomRight} {
          position: absolute;
          bottom: -${HANDLE_SIZE / 2}px;
          right: -${HANDLE_SIZE / 2}px;
          width: ${HANDLE_SIZE}px;
          height: ${HANDLE_SIZE}px;

          &:hover {
              cursor: nwse-resize;
          }
      }

      #${ResizeHandles.TopLeft} {
          position: absolute;
          top: -${HANDLE_SIZE / 2}px;
          left: -${HANDLE_SIZE / 2}px;
          width: ${HANDLE_SIZE}px;
          height: ${HANDLE_SIZE}px;

          &:hover {
              cursor: nwse-resize;
          }
      }

      #${ResizeHandles.TopRight} {
          position: absolute;
          top: -${HANDLE_SIZE / 2}px;
          right: -${HANDLE_SIZE / 2}px;
          width: ${HANDLE_SIZE}px;
          height: ${HANDLE_SIZE}px;

          &:hover {
              cursor: nesw-resize;
          }
      }

      #${ResizeHandles.Left} {
          position: absolute;
          top: ${HANDLE_SIZE / 2}px;
          left: -${HANDLE_SIZE / 2}px;
          width: ${HANDLE_SIZE}px;
          height: calc(100% - ${HANDLE_SIZE}px);

          &:hover {
              cursor: ew-resize;
          }
      }

      #${ResizeHandles.Right} {
          position: absolute;
          top: ${HANDLE_SIZE / 2}px;
          right: -${HANDLE_SIZE / 2}px;
          width: ${HANDLE_SIZE}px;
          height: calc(100% - ${HANDLE_SIZE}px);
          /* background-color: orange;
					opacity: .25; */

          &:hover {
              cursor: ew-resize;
          }
      }

      #${ResizeHandles.Top} {
          position: absolute;
          top: -${HANDLE_SIZE / 2}px;
          left: ${HANDLE_SIZE / 2}px;
          width: calc(100% - ${HANDLE_SIZE}px);
          height: ${HANDLE_SIZE}px;

          &:hover {
              cursor: ns-resize;
          }
      }

      #${ResizeHandles.Bottom} {
          position: absolute;
          bottom: -${HANDLE_SIZE / 2}px;
          left: ${HANDLE_SIZE / 2}px;
          width: calc(100% - ${HANDLE_SIZE}px);
          height: ${HANDLE_SIZE}px;

          &:hover {
              cursor: ns-resize;
          }
      }
	`

	@attribute("window-width", {converter: Number}) accessor window_width = 500

	@attribute("window-height", {converter: Number}) accessor window_height = 500

	@attribute("window-x", {converter: Number}) accessor window_x = 0

	@attribute("window-y", {converter: Number}) accessor window_y = 0
	@state() accessor content_ref = {value: null}
	@state() accessor title_bar_ref = {value: null}
	@state() accessor title_bar_height = 0;
	@state() accessor focused = true;
	title_bar_resizer: ResizeObserver | null = null;
	active_resize_handle: ResizeHandles | null = null;
	protected resize_vars = {
		prev_position: {x: 0, y: 0},
	}
	protected drag_vars = {
		prev_position: {x: 0, y: 0},
		offset: {x: 0, y: 0},
	}

	@attribute("min-width") get min_width() {
		return 200
	}

	@attribute("min-height") get min_height() {
		return 200
	}

	public close = () => {
		this.remove()
	}

	on_mount = () => {
		// set it's z index to the highest of all the windows
		let children = Array.from(this.parentElement.childNodes).filter(x => x instanceof Window)
		let highest = -1
		for (let c of children) {
			let z = parseInt(window.getComputedStyle(c).zIndex)
			if (z > highest) {
				highest = z
			}
			c.focused = false
		}
		this.focused = true
		this.style.zIndex = `${highest + 1}`
	}

	on_mounted = () => {
		// center window
		this.window_x = window.innerWidth / 2 - this.window_width / 2;
		this.window_y = window.innerHeight / 2 - this.window_height / 2;

		// observe title bar size
		this.title_bar_height = this.title_bar_ref.value.clientHeight;
		this.title_bar_resizer = new ResizeObserver(() => {
			this.title_bar_height = this.title_bar_ref.value.clientHeight;
		})
		this.title_bar_resizer.observe(this.title_bar_ref.value);

		effect(() => {
			this.style.height = `${this.window_height}px`
		})
		effect(() => {
			this.style.width = `${this.window_width}px`
		})
		effect(() => {
			this.style.transform = `translate(${this.window_x}px, ${this.window_y}px)`
		})
	}

	on_unmount = () => {
		this.title_bar_resizer?.disconnect()
	}

	override render = () => {
		let focus_style =
			`--focused: ${this.focused ? "initial" : " "}; --unfocused: ${!this.focused ? "initial" : " "};`
		return (
			<host
				// style={root_style}
				onmousedown={this.on_mouse_down} data-focused={this.focused}>
				<div
					id="title-bar"
					ref={this.title_bar_ref}
					onmousedown={this.on_drag_start}
				>
					<slot
						name="title-bar"
						style={focus_style}
					/>
				</div>
				<div
					id="content-wrapper"
					ref={this.content_ref}
					style={`height: calc(100% - ${this.title_bar_height}px);`}
				>
					<slot
						name="content"
						style={focus_style}
					/>
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

	protected get_transform_translate_coords = () => {
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

	protected on_resize_down = (e: MouseEvent) => {
		this.active_resize_handle = (e.target as HTMLElement).id as ResizeHandles;
		this.style.userSelect = "none";

		window.addEventListener("mousemove", this.on_resize_move);
		window.addEventListener("mouseup", this.on_resize_up);

		this.resize_vars.prev_position = {
			x: e.clientX,
			y: e.clientY,
		};
	}

	protected on_resize_move = (e) => {

		let resize_x = (e, dir) => {
			let x = (e.clientX - this.resize_vars.prev_position.x) * dir;
			let newPos = this.window_width + x;
			if (
				newPos < this.min_width
				|| e.clientX > window.innerWidth
				|| e.clientX < 0
			) {
				return;
			}
			this.window_width = this.window_width + x
			this.resize_vars.prev_position.x = e.clientX;
			if (dir < 0) {
				let transform = this.get_transform_translate_coords();
				// this.style.transform = `translate(${transform.x - x}px, ${transform.y}px)`;
				this.window_x = transform.x - x
				this.window_y = transform.y
			}
		}

		let resize_y = (e, dir) => {
			let y = (e.clientY - this.resize_vars.prev_position.y) * dir;
			let newPos = this.window_height + y;
			if (
				newPos < this.min_height
				|| e.clientY > window.innerHeight
				|| e.clientY < 0
			) {
				return;
			}
			this.window_height = this.window_height + y;
			this.resize_vars.prev_position.y = e.clientY;
			if (dir < 0) {
				let transform = this.get_transform_translate_coords();
				// this.style.transform = `translate(${transform.x}px, ${transform.y - y}px)`;
				this.window_x = transform.x
				this.window_y = transform.y - y
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

	protected on_resize_up = () => {
		this.active_resize_handle = null;
		this.style.userSelect = "auto";
		window.removeEventListener("mousemove", this.on_resize_move);
		window.removeEventListener("mouseup", this.on_resize_up);
	}

	protected on_drag_start = (e: MouseEvent) => {

		let x = this.get_transform_translate_coords().x;
		let y = this.get_transform_translate_coords().y;

		this.drag_vars.offset = {
			x: e.clientX - x,
			y: e.clientY - y,
		};

		window.addEventListener("mousemove", this.on_drag_move);
		window.addEventListener("mouseup", this.on_drag_end);
		this.title_bar_ref.value.style.cursor = "move"
	};

	protected on_drag_move = (e: MouseEvent) => {
		let bounds = this.getBoundingClientRect();

		let x = Math.max(
			(-bounds.width + 100),
			Math.min(e.clientX - this.drag_vars.offset.x, window.innerWidth - 100),
		);
		let y = Math.max(
			0,
			Math.min(e.clientY - this.drag_vars.offset.y, window.innerHeight - 100),
		);

		this.drag_vars.prev_position = {x, y};

		this.window_x = x
		this.window_y = y
	};

	protected on_drag_end = () => {
		this.title_bar_ref.value.style.cursor = "default"
		window.removeEventListener("mousemove", this.on_drag_move);
		window.removeEventListener("mouseup", this.on_drag_end);
	};

	protected on_window_resize = () => {
		let bounds = this.getBoundingClientRect();

		this.window_x = Math.max(
			0,
			Math.min(this.drag_vars.prev_position.x, window.innerWidth - bounds.width),
		);
		this.window_y = Math.max(
			0,
			Math.min(this.drag_vars.prev_position.y, window.innerHeight - bounds.height),
		);
	}

	protected on_mouse_down = (e: MouseEvent) => {
		let children = Array.from(this.parentElement.childNodes).filter(x => x instanceof Window)

		this.focused = true
		if (children.length <= 1) return

		let highest = 0;
		let highest_el: Window | null = null;
		children.sort((a, b) => {
			let a_z = parseInt(window.getComputedStyle(a).zIndex)
			let b_z = parseInt(window.getComputedStyle(b).zIndex)
			if (a_z > highest) {
				highest = a_z;
				highest_el = a;
			} else if (b_z > highest) {
				highest = b_z;
				highest_el = b;
			}
			return a_z - b_z;
		});


		this.focused = true

		if (highest_el === this) return;

		let this_z = parseInt(window.getComputedStyle(this).zIndex)
		this.style.zIndex = `${highest}`
		children.push(this)

		for (let i = this_z + 1; i < children.length - 1; i++) {
			children[i].focused = false
			children[i].style.zIndex = `${i - 1}`
		}
	}
}

Window.define_self("window-element")
