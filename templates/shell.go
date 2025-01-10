package templates

import (
	. "maragu.dev/gomponents"
	. "maragu.dev/gomponents/components"
	. "maragu.dev/gomponents/html"
)

func Template(children ...Node) Node {
	return El("template", children...)
}

func Slot(children ...Node) Node {
	return El("slot", children...)
}

func ClickAttr(e string) Node {
	return Attr("@click", e)
}

func TextAttr(e string) Node {
	return Attr(":text", e)
}

func RawStyle(e string) Node {
	return El("style", Raw(e))
}

func Shell(title string, head []Node, children []Node) Node {
	return HTML5(HTML5Props{
		Title:    title,
		Language: "en",
		Head: append([]Node{
			StyleEl(
				Raw(`body {transition: opacity .25s .3s;} [blackberry-cloak] {opacity: 0;}`),
			),
			Script(Src("/js/entry.tsx"), Type("module")),
			Link(
				Rel("stylesheet"),
				Type("text/css"),
				Href("/static/global.css"),
			),
			Link(
				Rel("icon"),
				Type("image/x-icon"),
				Href("/static/favicon.png"),
			),
		}, head...),
		Body: append([]Node{
			Attr("blackberry-cloak"),
		}, children...),
	})
}
