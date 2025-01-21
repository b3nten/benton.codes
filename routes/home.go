package routes

import (
	"benton.codes/core"
	. "benton.codes/templates"
	"benton.codes/www/posts"
	. "maragu.dev/gomponents"
	. "maragu.dev/gomponents/html"
)

func aWindow(children ...Node) Node {
	return El("a-window", A(children...))
}

func HomePage(app *core.App) Node {
	head := &[]Node{
		Meta(
			Type("description"),
			Content("My website where stuff is."),
		),
		Link(
			Rel("stylesheet"),
			Href(app.GetAssetPath("pages:home.css")),
		),
	}

	body := &[]Node{
		Header(
			EncryptedText(
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
				"mount",
			),
			Class("home_header cursor-default"),
		),
		Main(
			Class("home"),
			Waypoints(false),
			Spacer("0", "3rem"),
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
							aWindow(
								EncryptedText("elysia", "hover", "mount"),
								Href("/p/elysia"),
							),
						),
						Li(
							A(
								EncryptedText("blackberry.js", "hover", "mount"),
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
								EncryptedText("call of duty", "hover", "mount"),
								Href("/p/call-of-duty"),
							),
						),
						Li(
							A(
								EncryptedText("house of the dragon", "hover", "mount"),
								Href("/p/house-of-the-dragon"),
							),
						),
						Li(
							A(
								EncryptedText("chefs table", "hover", "mount"),
								Href("/p/chefs-table"),
							),
						),
						Li(
							A(
								EncryptedText("industry music", "hover", "mount"),
								Href("/p/industry-music"),
							),
						),
						Li(
							A(
								EncryptedText("droplab.com", "hover", "mount"),
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
								EncryptedText("lua templating with go", "hover", "mount"),
								Href("/p/lua-templating-with-go"),
							),
						),
						Li(
							A(
								EncryptedText("immediate mode web components", "hover", "mount"),
								Href("/p/immediate-mode-web-components"),
							),
						),
						Li(
							A(
								EncryptedText("lua for application configuration", "hover", "mount"),
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
								EncryptedText("building a web build pipeline with go & lua", "hover", "mount"),
								Href("/p/building-a-web-build-pipeline-with-go-and-lua"),
							),
						),
						Li(
							A(
								EncryptedText("introducing blackberry.js", "hover", "mount"),
								Href("/p/introducing-blackberry.js"),
							),
						),
					),
				),
			),
		),
	}

	return Shell(app, "Home", *head, *body)
}

func PostPage(app *core.App, post posts.Post) []Node {
	body := []Node{
		Article(
			El("animate-children",
				Attr(
					"id",
					"post",
				),
				Attr("on-mounted", `
					animate("#post > *",
					{
						y: ["-50%", 0],
						opacity: [0, 1]
					},
					{
						duration: .4,
						delay: stagger(.05, { startDelay: .5, easing: "easeIn" }),
						easing: "easeIn"
					})
				`),
				Raw(post.Content),
			),
		),
	}
	return body
}

func Waypoints(showHome bool) Node {
	var homelink Node

	if showHome {
		homelink = Li(
			A(
				EncryptedText("Home, ", "hover", "mount"),
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
					EncryptedText("github, ", "hover", "mount"),
					Class("waypoint_link"),
					Href("https://github.com/b3nten"),
					Target("_blank"),
				),
			),
			Li(
				A(
					EncryptedText("artstation, ", "hover", "mount"),
					Class("waypoint_link"),
					Href("https://www.artstation.com/benten28"),
					Target("_blank"),
				),
			),
			Li(
				A(
					EncryptedText("x.com", "hover", "mount"),
					Class("waypoint_link"),
					Href("https://x.com/Cohn_Jarmack"),
					Target("_blank"),
				),
			),
		),
	)
}

func NotFound(app *core.App) Node {
	return Shell(
		app,
		"404 Not Found",
		[]Node{
			Meta(
				Type("description"),
				Content("404 Not Found"),
			),
			Link(
				Rel("stylesheet"),
				Href(app.GetAssetPath("pages:home.css")),
			),
		},
		[]Node{
			Header(
				EncryptedText(
					"404 Not Found. The page you are looking for does not exist.",
					"mount",
				),
				Class("home_header cursor-default"),
			),
			Waypoints(true),
		},
	)
}
