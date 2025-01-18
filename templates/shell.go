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

func Spacer(x, y string) Node {
	return Div(
		Attr("style", "padding-left: "+x+"; padding-top: "+y+";"),
		Attr("aria-hidden", "true"),
	)
}

func CSSLink(e string) Node {
	if e[0] == '/' {
		e = e[1:]
	}
	return Link(
		Rel("stylesheet"),
		Type("text/css"),
		Href("/__css/" + e),
	)
}

func ScriptLink(e string, attrs... Node) Node {
	if e[0] == '/' {
		e = e[1:]
	}
	return Script(
		append([]Node{
			Src("/__js/" + e),
		}, attrs...)...,
	)
}

func EncryptedText(e string, args... string) Node {
	attrs := []Node{
		Text(e),
	}
	for _, arg := range args {
		attrs = append(attrs, Attr(arg, ""))
	}
	return El(
		"encrypted-text",
		attrs...,
	)
}

func Shell(title string, head []Node, children []Node) Node {
	return HTML5(HTML5Props{
		Title:    title,
		Language: "en",
		Head: append([]Node{
			StyleEl(
				Raw(`body {transition: opacity .25s .3s;} [blackberry-cloak] {opacity: 0;}`),
			),
			ScriptLink("main.js", Type("module"), Attr("defer", "")),
			CSSLink("global.css"),
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
