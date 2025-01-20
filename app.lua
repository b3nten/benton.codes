function optimize(prop)
    if is_dev then return prop end
    prop.bundle = true
    prop.minify = true
    return prop
end

js_main =js {
    name = "main.js",
    src = "www/js/entry.tsx",
}

global_css = css {
    name = "global.css",
    src = "www/css/global.css",
}

home_css = css {
    name = "pages:home.css",
    src = "www/css/home/styles.css",
    bundle = true,
    minify = true,
}

app {
    name = "benton.codes",
    port = 8000,
    static_dir = "www/static/",
    assets = {
        optimize(js_main),
        optimize(global_css),
        optimize(home_css),
    },
    routes = {
        { path = "/about", handler = "routes/about.lua" }
    }
}
