package templates

import (
	. "maragu.dev/gomponents"
	. "maragu.dev/gomponents/html"
)

func HomePage() Node {

	head := &[]Node{
		Meta(
			Type("description"),
			Content("My website where stuff is."),
		),
	}

	body := &[]Node{
		Main(
			Class("home"),
		),
	}

	return Shell("Home", *head, *body)
}
