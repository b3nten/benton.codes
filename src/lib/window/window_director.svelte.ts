import { state } from "$lib";
import type { Snippet } from "svelte";
import { SvelteSet } from "svelte/reactivity";

type WindowID = string | number;

export interface WindowDefinition {
  uuid: WindowID;
  title: string;
  content: Snippet;
  min_width?: number;
  min_height?: number;
  max_width?: number;
  max_height?: number;
}

class WindowInstance {
  constructor(window: WindowDefinition) {
    this.uuid = window.uuid;
    this.title = window.title;
    this.content = window.content;
    window.min_width && (this.min_width = window.min_width);
    window.min_height && (this.min_height = window.min_height);
    window.max_width && (this.max_width = window.max_width);
    window.max_height && (this.max_height = window.max_height);
  }
  @state accessor uuid: WindowID;
  @state accessor title: string;
  @state accessor content: Snippet | null = null;
  @state accessor x = 0;
  @state accessor y = 0;
  @state accessor width = 0;
  @state accessor height = 0;
  @state accessor focused = false;
  @state accessor min_width = 0;
  @state accessor min_height = 0;
  @state accessor max_width = Infinity;
  @state accessor max_height = Infinity;
}

export class WindowDirector {
  windows = new SvelteSet<WindowDefinition>();
  uuid_map = new Map<WindowID, WindowDefinition>();
  elements = new Map<WindowID, HTMLElement>();

  window_iterator = () => this.windows.values();

  make_window = (
    window: WindowDefinition & {
      height?: number;
      width?: number;
      x?: number;
      y?: number;
      focused?: boolean;
    },
  ) => {
    this.windows.add(window);
  };

  kill_window = (window: WindowDefinition | WindowID) => {};

  move_window = (
    window: WindowDefinition | WindowID,
    x: number,
    y: number,
  ) => {};

  resize_window = (
    window: WindowDefinition | WindowID,
    width: number,
    height: number,
  ) => {};

  focus_window = (window: WindowDefinition | WindowID) => {};

  /**
   * @internal
   * Used by Window Container to delegate actions
   */
  _actions = {
    on_resize_handle_down: () => {},
    on_title_drag_start: () => {},
    on_window_mouse_down: () => {},
    on_close_fired: (window: WindowDefinition | WindowID) => {
      this.kill_window(window);
    },
  };
}
