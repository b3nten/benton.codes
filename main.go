package main

import (
	"fmt"
	"net/http"
)

func main() {

	config := Config{
		port:    "8080",
		mode:    GetMode(),
		timeout: 5,
	}
	logger := NewLogger()
	routes := RegisterRoutes(config, logger)

	logger.Info("Starting server", "port", config.port)

	if err := http.ListenAndServe(fmt.Sprintf(":%s", config.port), routes); err != nil {
		logger.Error("Failed to start server:", "error", err)
	}
}
