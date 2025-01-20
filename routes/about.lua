response.status = 200

response.body = shell {
    title = "About",
    head = {
        link { rel = "stylesheet", href = "poop" }
    },
    body = {
        h1 "Hello world!"
    },
}
