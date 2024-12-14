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

	server := &http.Server{
		Addr:    fmt.Sprintf(":%s", config.port),
		Handler: routes,
	}

	defer func() {
		logger.Info("Shutting down server")
		server.Close()
	}()

	if err := server.ListenAndServe(); err != nil {
		logger.Error("Failed to start server", "error", err)
	}
}
