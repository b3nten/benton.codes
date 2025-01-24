package main

import (
	"fmt"
	"net/http"
	"strconv"

	"benton.codes/core"
	"benton.codes/server"
	"benton.codes/www/posts"
)

func main() {
	// load config from app.lua
	a := core.LoadFromConfig()
	// create chi server
	s := server.NewServer(a)
	// init posts package
	posts.Init(a)

	fmt.Println("Starting server on port", a.Port)
	if err := http.ListenAndServe(":"+strconv.Itoa(a.Port), s); err != nil {
		panic(err)
	}
}
