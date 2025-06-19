package routes

import (
	"net/http"

	"benton.codes/core"
	"benton.codes/templates"
	"benton.codes/www/posts"
	. "maragu.dev/gomponents"
	. "maragu.dev/gomponents/html"
)

var headerText = core.Dedent(`
	Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
`)

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
				headerText,
				"mount",
			),
			Class("home_header cursor-default"),
		),
		Main(
			Class("home"),
			waypoints(false),
			templates.Spacer("0", "3rem"),
			Div(
				Class("home_content"),
				Section(
					Class("home_section_container"),
					H2(
						Text("Work"),
						Class("home_section_title"),
					),
					Ul(
						Class("home_section_list"),
						Li(
							homeWindow(
								"call of duty",
								templates.EncryptedText("call of duty", "hover", "mount"),
								Href("/p/call-of-duty"),
							),
						),
						Li(
							homeWindow(
								"house of the dragon",
								templates.EncryptedText("house of the dragon", "hover", "mount"),
								Href("/p/house-of-the-dragon"),
							),
						),
						Li(
							homeWindow(
								"chefs table",
								templates.EncryptedText("chefs table", "hover", "mount"),
								Href("/p/chefs-table"),
							),
						),
						Li(
							homeWindow(
								"industry music",
								templates.EncryptedText("industry music", "hover", "mount"),
								Href("/p/industry-music"),
							),
						),
						Li(
							homeWindow(
								"moon my meme",
								templates.EncryptedText("moon my meme", "hover", "mount"),
								Href("/p/moon-my-meme"),
							),
						),
						Li(
							homeWindow(
								"leroy & rose",
								templates.EncryptedText("leroy & rose", "hover", "mount"),
								Href("/p/leroy-and-rose"),
							),
						),
						Li(
							homeWindow(
								"droplab.com",
								templates.EncryptedText("droplab.com", "hover", "mount"),
								Href("/p/droplab.com"),
							),
						),
					),
				),
				Section(
					Class("home_section_container"),
					H2(
						Text("Projects"),
						Class("home_section_title"),
					),
					Ul(
						Class("home_section_list"),
						Li(
							homeWindow(
								"elysia",
								templates.EncryptedText("elysia", "hover", "mount"),
								Href("/p/elysia"),
							),
						),
						Li(
							homeWindow(
								"vono",
								templates.EncryptedText("vono", "hover", "mount"),
								Href("/p/vono"),
							),
						),
						Li(
							homeWindow(
								"blackberry.js",
								templates.EncryptedText("blackberry.js", "hover", "mount"),
								Href("/p/blackberry-js"),
							),
						),
					),
				),
			),
		),
	}

	return homeShell(app, "Home", *head, *body)
}

func HomePostPage(app *core.App, w http.ResponseWriter, path string, fragment bool) {
	post, err := posts.Get(path)

	if err != nil {
		w.WriteHeader(404)
		HomeNotFound(app).Render(w)
		return
	}

	article := Article(
		Class("home-post"),
		// El(
		// 	"animate-children",
		// 	Attr(
		// 		"on-mounted", `
		// 			animate(this.childNodes,
		// 			{
		// 				y: ["-50%", 0],
		// 				opacity: [0, 1]
		// 			},
		// 			{
		// 				duration: .4,
		// 				delay: stagger(.05, { startDelay: .5, easing: "easeIn" }),
		// 				easing: "easeIn"
		// 			})
		// 		`,
		// 	),
		// Raw(post.Content),
		// ),
		Raw(post.Content),
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
		renderable = homeShell(
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
				waypoints(true),
				templates.Spacer("0", "3rem"),
				article,
			},
		)
	}

	renderable.Render(w)

}

func HomeNotFound(app *core.App) Node {
	return homeShell(
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
			waypoints(true),
		},
	)
}

func homeShell(app *core.App, title string, head []Node, children []Node) Node {
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

func homeWindow(title string, children ...Node) Node {
	return El("home-window-link", Attr("window-title", title), A(children...))
}

func waypoints(showHome bool) Node {
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
					Href("https://x.com/_b_e_n_t_o_n_"),
					Target("_blank"),
				),
			),
		),
	)
}
