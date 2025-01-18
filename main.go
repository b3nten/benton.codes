package main

import (
	"net/http"
	"strconv"

	"benton.codes/core"
	"benton.codes/server"
)

func main() {
	app := core.LoadApp();
	server := server.NewServer(app)
	if err := http.ListenAndServe(":"+ strconv.Itoa(app.Port), server); err != nil {
		panic(err)
	}
}
