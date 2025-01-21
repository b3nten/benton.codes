package posts

import (
	"embed"
	"os"

	"io"
	"strings"

	"golang.org/x/net/html"
)

//go:embed *.html
var postFS embed.FS

type Posts interface {
	Get(string) (Post, error)
}

var FS Posts

type Post struct {
	Title string
	Header string
	Description string
	Content string
}

type devPostFs struct {}

func (fs *devPostFs) Get(path string) (Post, error) {

	post, err := os.Open("www/posts/" + path + ".html")

	if err != nil {
		return Post{}, err
	}

	postBytes, err := io.ReadAll(post)

	parsed, err := html.ParseFragment(
		strings.NewReader(string(postBytes)),
		nil,
	)

	postData := &Post{}
	postData.Content = string(postBytes)

	parseRow(parsed[0], postData)

	return *postData, nil
}

func init() {
	FS = &devPostFs{}
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
