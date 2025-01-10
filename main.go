package main

import (
	"benton.codes/core"
	"benton.codes/server"
	"net/http"
)

func main() {
	config := core.GetConfig()
	server := server.NewServer(config)

	if err := http.ListenAndServe(config.Addr, server); err != nil {
		panic(err)
	}
}
