<script lang="ts">
import type {
	WindowDefinition,
	WindowDirector,
} from "./window_director.svelte";

let {
	director,
	window_def = {
		content: "HELLO",
		uuid: "test",
		title: "Test Window",
	},
}: {
	director: WindowDirector;
	window_def: WindowDefinition;
} = $props();

let root: HTMLElement | undefined; // no reactivity needed
</script>

<div
  bind:this={root}
  class="root"
  onmousedown={director._actions.on_window_mouse_down}
>
  <div class="title-bar" onmousedown={director._actions.on_title_drag_start}>
    {window_def.title}
  </div>
  <div class="content">WINDOW CONTENT</div>
  <div
    onmousedown={director._actions.on_resize_handle_down}
    data-handle-type="top"
  ></div>
  <div
    onmousedown={director._actions.on_resize_handle_down}
    data-handle-type="left"
  ></div>
  <div
    onmousedown={director._actions.on_resize_handle_down}
    data-handle-type="right"
  ></div>
  <div
    onmousedown={director._actions.on_resize_handle_down}
    data-handle-type="bottom"
  ></div>
  <div
    onmousedown={director._actions.on_resize_handle_down}
    data-handle-type="bottom-left"
  ></div>
  <div
    onmousedown={director._actions.on_resize_handle_down}
    data-handle-type="bottom-right"
  ></div>
  <div
    onmousedown={director._actions.on_resize_handle_down}
    data-handle-type="top-left"
  ></div>
  <div
    onmousedown={director._actions.on_resize_handle_down}
    data-handle-type="top-right"
  ></div>
</div>

<style>
  .root {
    box-sizing: border-box;
    margin: 0;
    display: block;
    position: fixed;
    top: 0px;
    left: 0px;
    --handle-size: 14px;
    --title-height: 32px;
  }
  .title-bar {
    cursor: default;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    overflow: hidden;
    height: var(--title-height);
    padding: 0.125rem;
    background-color: limegreen;
  }
  .content {
    width: 100%;
    height: calc(100% - var(--title-height));
    overflow: hidden;
    padding: 1rem;
    background-color: palegreen;
  }
  [data-handle-type="bottom-left"] {
    position: absolute;
    bottom: calc(var(--handle-size) / -2);
    left: calc(var(--handle-size) / -2);
    width: var(--handle-size);
    height: var(--handle-size);
    &:hover {
      cursor: nesw-resize;
    }
  }
  [data-handle-type="bottom-right"] {
    position: absolute;
    bottom: calc(var(--handle-size) / -2);
    right: calc(var(--handle-size) / -2);
    width: var(--handle-size);
    height: var(--handle-size);
    &:hover {
      cursor: nwse-resize;
    }
  }
  [data-handle-type="top-left"] {
    position: absolute;
    top: calc(var(--handle-size) / -2);
    left: calc(var(--handle-size) / -2);
    width: var(--handle-size);
    height: var(--handle-size);
    &:hover {
      cursor: nwse-resize;
    }
  }
  [data-handle-type="top-right"] {
    position: absolute;
    top: calc(var(--handle-size) / -2);
    right: calc(var(--handle-size) / -2);
    width: var(--handle-size);
    height: var(--handle-size);
    &:hover {
      cursor: nesw-resize;
    }
  }
  [data-handle-type="left"] {
    position: absolute;
    top: calc(var(--handle-size) / 2);
    left: calc(var(--handle-size) / -2);
    width: var(--handle-size);
    height: calc(100% - var(--handle-size));
    &:hover {
      cursor: ew-resize;
    }
  }
  [data-handle-type="right"] {
    position: absolute;
    top: calc(var(--handle-size) / 2);
    right: calc(var(--handle-size) / -2);
    width: var(--handle-size);
    height: calc(100% - var(--handle-size));
    &:hover {
      cursor: ew-resize;
    }
  }
  [data-handle-type="top"] {
    position: absolute;
    top: calc(var(--handle-size) / -2);
    left: calc(var(--handle-size) / 2);
    width: calc(100% - var(--handle-size));
    height: var(--handle-size);
    &:hover {
      cursor: ns-resize;
    }
  }
  [data-handle-type="bottom"] {
    position: absolute;
    bottom: calc(var(--handle-size) / -2);
    left: calc(var(--handle-size) / 2);
    width: calc(100% - var(--handle-size));
    height: var(--handle-size);
    &:hover {
      cursor: ns-resize;
    }
  }
</style>
