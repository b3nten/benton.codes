package routes

import (
	"benton.codes/core"
	"benton.codes/templates"
	"benton.codes/www/posts"
	. "maragu.dev/gomponents"
	. "maragu.dev/gomponents/html"
	"net/http"
)

func HomeShell(app *core.App, title string, head []Node, children []Node) Node {
	return templates.Shell(
		app,
		title,
		append(
			[]Node{
				Link(
					Rel("stylesheet"),
					Href(app.GetAssetPath("home.css")),
				),
				Script(
					Type("module"),
					Src(app.GetAssetPath("home.js")),
					Defer(),
				),
			}, head...,
		),
		children,
	)

}

func HomeWindow(title string, children ...Node) Node {
	return El("home-window-link", Attr("window-title", title), A(children...))
}

func HomePage(app *core.App) Node {
	head := &[]Node{
		Meta(
			Type("description"),
			Content("My website where stuff is."),
		),
	}
	body := &[]Node{
		Header(
			templates.EncryptedText(
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
				"mount",
			),
			Class("home_header cursor-default"),
		),
		Main(
			Class("home"),
			Waypoints(false),
			templates.Spacer("0", "3rem"),
			Div(
				Class("home_content"),
				Section(
					Class("home_section_container"),
					H2(
						Text("Projects"),
						Class("home_section_title"),
					),
					Ul(
						Class("home_section_list"),
						Li(
							HomeWindow(
								"elysia",
								templates.EncryptedText("elysia", "hover", "mount"),
								Href("/p/elysia"),
							),
						),
						Li(
							A(
								templates.EncryptedText("blackberry.js", "hover", "mount"),
								Href("/p/blackberry.js"),
							),
						),
					),
				),
				Section(
					Class("home_section_container"),
					H2(
						Text("Work"),
						Class("home_section_title"),
					),
					Ul(
						Class("home_section_list"),
						Li(
							A(
								templates.EncryptedText("call of duty", "hover", "mount"),
								Href("/p/call-of-duty"),
							),
						),
						Li(
							A(
								templates.EncryptedText("house of the dragon", "hover", "mount"),
								Href("/p/house-of-the-dragon"),
							),
						),
						Li(
							A(
								templates.EncryptedText("chefs table", "hover", "mount"),
								Href("/p/chefs-table"),
							),
						),
						Li(
							A(
								templates.EncryptedText("industry music", "hover", "mount"),
								Href("/p/industry-music"),
							),
						),
						Li(
							A(
								templates.EncryptedText("droplab.com", "hover", "mount"),
								Href("/p/droplab.com"),
							),
						),
					),
				),
				Section(
					Class("home_section_container"),
					H2(
						Text("Experiments"),
						Class("home_section_title"),
					),
					Ul(
						Class("home_section_list"),
						Li(
							A(
								templates.EncryptedText("lua templating with go", "hover", "mount"),
								Href("/p/lua-templating-with-go"),
							),
						),
						Li(
							A(
								templates.EncryptedText("immediate mode web components", "hover", "mount"),
								Href("/p/immediate-mode-web-components"),
							),
						),
						Li(
							A(
								templates.EncryptedText("lua for application configuration", "hover", "mount"),
								Href("/p/lua-for-application-configuration"),
							),
						),
					),
				),
				Section(
					Class("home_section_container"),
					H2(
						Text("Blog"),
						Class("home_section_title"),
					),
					Ul(
						Class("home_section_list"),
						Li(
							A(
								templates.EncryptedText(
									"building a web build pipeline with go & lua", "hover", "mount",
								),
								Href("/p/building-a-web-build-pipeline-with-go-and-lua"),
							),
						),
						Li(
							A(
								templates.EncryptedText("introducing blackberry.js", "hover", "mount"),
								Href("/p/introducing-blackberry.js"),
							),
						),
					),
				),
			),
		),
	}

	return HomeShell(app, "Home", *head, *body)
}

func HomePostPage(app *core.App, w http.ResponseWriter, path string, fragment bool) {
	post, err := posts.FS.Get(path)

	if err != nil {
		w.WriteHeader(404)
		HomeNotFound(app).Render(w)
		return
	}

	article := Article(
		El(
			"animate-children",
			Attr(
				"on-mounted", `
					animate(this.childNodes,
					{
						y: ["-50%", 0],
						opacity: [0, 1]
					},
					{
						duration: .4,
						delay: stagger(.05, { startDelay: .5, easing: "easeIn" }),
						easing: "easeIn"
					})
				`,
			),
			Raw(post.Content),
		),
	)

	var renderable Node

	if fragment {
		renderable = Div(
			Class("p04"),
			Header(
				templates.EncryptedText(
					post.Header,
					"mount",
					"hover",
				),
				Class("home_header cursor-default window"),
			),
			article,
		)
	} else {
		renderable = HomeShell(
			app,
			post.Title,
			[]Node{
				Meta(
					Type("description"),
					Content(post.Description),
				),
			},
			[]Node{
				Header(
					templates.EncryptedText(
						post.Header,
						"mount",
					),
					Class("home_header cursor-default"),
				),
				Waypoints(true),
				templates.Spacer("0", "3rem"),
				article,
			},
		)
	}

	renderable.Render(w)

}

func Waypoints(showHome bool) Node {
	var homelink Node

	if showHome {
		homelink = Li(
			A(
				templates.EncryptedText("Home, ", "hover", "mount"),
				Class("waypoint_link bold"),
				Href("/"),
			),
		)
	} else {
		homelink = Raw("")
	}

	return Div(
		Class("waypoint_root"),
		H2(
			Text("waypoints:"),
			Class("waypoint_title"),
		),
		Ul(
			Class("waypoint_list"),
			homelink,
			Li(
				A(
					templates.EncryptedText("github, ", "hover", "mount"),
					Class("waypoint_link"),
					Href("https://github.com/b3nten"),
					Target("_blank"),
				),
			),
			Li(
				A(
					templates.EncryptedText("artstation, ", "hover", "mount"),
					Class("waypoint_link"),
					Href("https://www.artstation.com/benten28"),
					Target("_blank"),
				),
			),
			Li(
				A(
					templates.EncryptedText("x.com", "hover", "mount"),
					Class("waypoint_link"),
					Href("https://x.com/Cohn_Jarmack"),
					Target("_blank"),
				),
			),
		),
	)
}

func HomeNotFound(app *core.App) Node {
	return HomeShell(
		app,
		"404 Not Found",
		[]Node{
			Meta(
				Type("description"),
				Content("404 Not Found"),
			),
		},
		[]Node{
			Header(
				templates.EncryptedText(
					"404 Not Found. The page you are looking for does not exist.",
					"mount",
				),
				Class("home_header cursor-default"),
			),
			Waypoints(true),
		},
	)
}
