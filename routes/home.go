package routes

import (
	"benton.codes/core"
	. "benton.codes/templates"
	. "maragu.dev/gomponents"
	. "maragu.dev/gomponents/html"
)

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
			Waypoints(),
			Spacer("0", "3rem"),
			homeContent(),
		),
	}

	return Shell(app, "Home", *head, *body)
}

func Waypoints() Node {
	return Div(
		Class("waypoint_root"),
		H2(
			Text("Waypoints:"),
			Class("waypoint_title"),
		),
		Ul(
			Class("waypoint_list"),
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

func homeContent() Node {
	return Div(
		Class("home_content"),
		Div(
			Class("home_section_container"),
			H2(
				Text("Projects"),
				Class("home_section_title"),
			),
			Ul(
				Class("home_section_list"),
				Li(
					A(
						EncryptedText("elysia", "hover", "mount"),
						Href("/p/elysia"),
					),
				),
				Li(
					A(
						EncryptedText("vono", "hover", "mount"),
						Href("/p/vono"),
					),
				),
				Li(
					A(
						EncryptedText("blackberry", "hover", "mount"),
						Href("/p/blackberry"),
					),
				),
			),
		),
		Div(
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
						Href(""),
					),
				),
				Li(
					A(
						EncryptedText("house of the dragon", "hover", "mount"),
						Href(""),
					),
				),
				Li(
					A(
						EncryptedText("chefs table", "hover", "mount"),
						Href(""),
					),
				),
				Li(
					A(
						EncryptedText("droplab.com", "hover", "mount"),
						Href(""),
					),
				),
			),
		),
		Div(
			Class("home_section_container"),
			H2(
				Text("Experiments"),
				Class("home_section_title"),
			),
			Ul(
				Class("home_section_list"),
				Li(
					A(
						EncryptedText("lua templating with redbean", "hover", "mount"),
						Href(""),
					),
				),
				Li(
					A(
						EncryptedText("immediate mode web components", "hover", "mount"),
						Href(""),
					),
				),
			),
		),
		Div(
			Class("home_section_container"),
			H2(
				Text("Blog"),
				Class("home_section_title"),
			),
			Ul(
				Class("home_section_list"),
				Li(
					A(
						EncryptedText("loving results instead of tools", "hover", "mount"),
						Href(""),
					),
				),
				Li(
					A(
						EncryptedText("beginners guide to elysia", "hover", "mount"),
						Href(""),
					),
				),
				Li(
					A(
						EncryptedText("i love html", "hover", "mount"),
						Href(""),
					),
				),
			),
		),
	)
}
