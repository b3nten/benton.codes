function main() {
    const templates = document.getElementsByTagName('template')

    for(const tl of templates){

        if(!tl.hasAttribute('component')) continue;

        const style = tl.content.querySelector('style[scoped]')
        const styleContent = `@import url(/static/styles.css);\n`+(style ? style.innerHTML : '')
        const sheet = new CSSStyleSheet()

        if(style) {
            sheet.replaceSync(style.innerHTML)
            tl.content.removeChild(style)
        }

        const setup = tl.content.querySelector('script[setup]')
        let setupContent = null;
        if(setup) {
            setupContent = setup.innerHTML;
            tl.content.removeChild(setup)
        }

        const props = tl.getAttribute("props")?.split(',').map(p => p.trim()) || []
        const compTagName = tl.getAttribute('component')

        const setupFn = new Function('$props', '$element', '$destroy',`
            ${setupContent}            
            return {
                __data: typeof $data === 'undefined' ? {} : $data,
            }
        `)

        Alpine.data(compTagName.replace('-', ''), () => {
            let destroyFns = []
            let $destroy = (fn) => destroyFns.push(fn)
            return {
                init(){
                    const setup = setupFn.bind(this)(this.$root.__element.props, this.$root.__element, $destroy)
                    Object.assign(this, setup.__data)
                    this.props = this.$root.__element.props
                },
                destroy(){
                    destroyFns.forEach(fn => fn())
                }
            }
        })

        customElements.define(compTagName, class extends HTMLElement
        {

            static get observedAttributes() {
                return props;
            }

            props = Alpine.reactive({})

            attributeChangedCallback (name, oldValue, newValue) {
                let val;
                try { val = JSON.parse(newValue) } catch { val = newValue }
                this.props[name] = val
            }

            constructor() {
                super();
                this.attachShadow({mode: 'open'});
            }

            connectedCallback()
            {
                this.shadowRoot.adoptedStyleSheets = [sheet]
                const div = document.createElement('div')
                div.setAttribute('x-data', compTagName.replace('-', ''))
                div.__element = this;
                this.shadowRoot.appendChild(div)
                div.append(tl.content.cloneNode(true))
                Alpine.initTree(this.shadowRoot);
            }

            disconnectedCallback()
            {
                Alpine.destroyTree(this.shadowRoot)
            }
        })
    }
}

window.addEventListener("load", () => {
    main()
})