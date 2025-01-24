package posts

import (
	"embed"
	"os"

	"io"
	"strings"

	"benton.codes/core"
	"golang.org/x/net/html"
)

//go:embed *.html
var postFS embed.FS

type Post struct {
	Title string
	Header string
	Description string
	Content string
}

var mode core.Mode

func Init(a *core.App) {
	mode = a.Mode
}

func Get(path string) (Post, error) {
	var post []byte

	if mode == core.ModeDev {
		postFile, err := os.Open("www/posts/" + path + ".html")
		if err != nil {
			return Post{}, err
		}
		defer postFile.Close()
		post, err = io.ReadAll(postFile)
	} else {
		postFile, err := postFS.Open(path + ".html")
		if err != nil {
			return Post{}, err
		}
		defer postFile.Close()
		post, err = io.ReadAll(postFile)
	}

	parsed, err := html.ParseFragment(
		strings.NewReader(string(post)),
		nil,
	)

	if err != nil {
		return Post{}, err
	}

	postData := &Post{}
	postData.Content = string(post)

	parseRow(parsed[0], postData)

	return *postData, nil
}

func parseRow(row *html.Node, post *Post) {
	if row.Data == "title" {
		post.Title = row.FirstChild.Data
	}
	if(row.Data == "meta"){
		var name string
		var value string
		for attr := range row.Attr {
			if row.Attr[attr].Key == "name" {
				name = row.Attr[attr].Val
			}
			if row.Attr[attr].Key == "content" {
				value = row.Attr[attr].Val
			}
		}
		if name == "description" {
			post.Description = value
		}
		if name == "header" {
			post.Header = value
		}
	}
	for attr := range row.ChildNodes() {
		parseRow(attr, post)
	}
}
