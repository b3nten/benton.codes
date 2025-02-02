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
    name = "home.css",
    src = "www/css/home.css"
}

js_home = js {
    name = "home.js",
    src = "www/js/home.tsx"
}

app {
    name = "benton.codes",
    port = 8000,
    static_dir = "www/static/",
    assets = {
        global_css,
        home_css,
        js_main,
        js_home,
    },
}
