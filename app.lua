js_main = js {
    name = "main.js",
    src = "www/js/entry.tsx",
    bundle = true,
    minify = true,
}

global_css = css {
    name = "global.css",
    src = "www/css/global.css"
}

home_css = css {
    name = "page::home.css",
    src = "www/css/home/styles.css"
}

app {
    name = "benton.codes",
    port = 8000,
    js = { js_main },
    css = { global_css, home_css },
    static = "www/static",
    assets = {
        { src="models/model.gltf", builder = "gltf" },
    }
}
