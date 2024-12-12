import * as Vue from "https://unpkg.com/vue@3.5.13/dist/vue.esm-browser.js"
globalThis.Vue = Vue

function main() {
    const templates = document.getElementsByTagName('template')

    for(const tl of templates){
        if(!tl.hasAttribute('component')) continue;

        const setup = tl.content.querySelector('script[setup]')
        const style = tl.content.querySelector('style[scoped]')
        const styleContent = style ? style.innerHTML : ''
        const sheet = new CSSStyleSheet()

        if(style) {
            sheet.replaceSync(style.innerHTML)
            tl.content.removeChild(style)
        }

        let setupContent = null;
        if(setup) {
            setupContent = setup.innerHTML;
            tl.content.removeChild(setup)
        }

        const template = tl.innerHTML.trim();
        const props = tl.getAttribute("props")?.split(',').map(p => p.trim()) || []

        const setupFn = new Function('$props',`
            // generated
            const $ref = Vue.ref
            const $box = Vue.reactive
            const $watch = Vue.watch
            const $computed = Vue.computed
            const $root = Vue.useShadowRoot()
            const $el = Vue.useHost()
            const $reflect = (prop, as = String) => {
                let v = $computed(() => as($props[prop]))
                return Vue.customRef((track) => ({
                    get() { track(); return v.value },
                    set(val) { $el.setAttribute(prop, String(val)); }
                }))
            }
            //end generated
            ${setupContent}
            // generated
            let $__state = typeof $state === 'object' ? $state : {}
            $__state.props = $props
            let $__onMount = typeof onMount === 'function' ? onMount : () => {}
            let $__onUnmount = typeof onUnmount === 'function' ? onUnmount : () => {}
            let $__onUpdated = typeof onUpdate === 'function' ? onUpdate : () => {}
            return [$__state, $__onMount, $__onUnmount, $__onUpdated]
            // end generated
        `)

        const cmp = Vue.defineCustomElement({
            props: props.reduce((acc, prop) => {
                acc[prop] = {type: String}
                return acc
            }, {}),
            template,
            styles: [styleContent],
            delimiters: ["{", "}"],
            compilerOptions: {
                delimiters: ["{", "}"]
            },
            setup(props){
                const [state, onMount, onUnmount, onUpdated] = setupFn(props)
                Vue.onMounted(() => onMount())
                Vue.onBeforeUnmount(() => onUnmount())
                Vue.onUpdated(() => onUpdated())
                return state
            },
        })

        customElements.define(tl.getAttribute('component'), cmp)

        // customElements.define(tl.getAttribute('component'), class extends HTMLElement
        // {
        //     static get observedAttributes() {
        //         return props;
        //     }
        //
        //     props = Vue.reactive({})
        //
        //     attributeChangedCallback (name, oldValue, newValue) {
        //         this.props[name] = newValue
        //     }
        //
        //     constructor() {
        //         super();
        //         this.attachShadow({mode: 'open'});
        //     }
        //
        //     connectedCallback()
        //     {
        //         this.shadowRoot.adoptedStyleSheets = [sheet]
        //
        //         const setup = new Function('$props', '$children',`
        //             // generated
        //             ref = Vue.ref
        //             reactive = Vue.reactive
        //             watch = Vue.watch
        //             computed = Vue.computed
        //             onMounted = Vue.onMounted
        //             onUnmounted = Vue.onUnmounted
        //             onUpdated = Vue.onUpdated
        //             //end generated
        //
        //             ${setupContent}
        //
        //             // generated
        //             let $__state = typeof $state === 'object' ? $state : {}
        //             $__state.props = $props
        //             let $__onMount = typeof onMount === 'function' ? onMount : () => {}
        //             let $__onUnmount = typeof onUnmount === 'function' ? onUnmount : () => {}
        //             return [$__state, $__onMount, $__onUnmount]
        //             // end generated
        //         `)
        //
        //         let props = this.props;
        //         let children = this.children;
        //
        //         this.vueApp = Vue.createApp({
        //             template,
        //             setup() {
        //                 const [state, onMount, onUnmount] = setup(props, children)
        //                 onMount()
        //                 Vue.onBeforeUnmount(() => onUnmount())
        //                 return state
        //             },
        //             delimiters: ["{", "}"],
        //             compilerOptions: {
        //                 delimiters: ["{", "}"]
        //             }
        //         }).mount(this.shadowRoot)
        //     }
        //
        //     disconnectedCallback()
        //     {
        //         this.vueApp.unmount()
        //     }
        // })
    }
}

window.addEventListener("load", () => {
    main()
})