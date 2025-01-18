import {
  h as _h,
  Fragment,
  Ivysaur,
  reactive as _reactive,
  state as _state,
  attribute as _attribute,
  css as _css,
  effect as _effect
} from 'blackberry.js'

declare global {
  var Component: typeof Ivysaur
  var reactive: typeof _reactive
  var effect: typeof _effect
  var state: typeof _state
  var attribute: typeof _attribute
  var css: typeof _css
}

globalThis.h = _h
globalThis.Fragment = Fragment
globalThis.Component = Ivysaur
globalThis.reactive = _reactive
globalThis.effect = _effect
globalThis.state = _state
globalThis.attribute = _attribute
globalThis.css = _css
