package main

import (
	"fmt"
	"net/http"
	"strconv"

	"benton.codes/core"
	"benton.codes/server"
)

func main() {
	a := core.LoadFromConfig()
	s := server.NewServer(a)
	fmt.Println("Starting server on port", a.Port)
	if err := http.ListenAndServe(":"+strconv.Itoa(a.Port), s); err != nil {
		panic(err)
	}
}
