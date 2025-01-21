js_main = js {
    name = "main.js",
    src = "www/js/entry.tsx",
    minify = is_prod,
}

global_css = css {
    name = "global.css",
    src = "www/css/global.css",
    minify = is_prod,
}

home_css = css {
    name = "pages:home.css",
    src = "www/css/home/styles.css",
    minify = is_prod,
}

app {
    name = "benton.codes",
    port = 8000,
    static_dir = "www/static/",
    assets = {
        js_main,
        global_css,
        home_css,
    },
    routes = {
        { path = "/about", handler = "routes/about.lua" }
    }
}
