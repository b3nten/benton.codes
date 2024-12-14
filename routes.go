package main

import (
	"bentoncodes/templates"
	"embed"
	"github.com/a-h/templ"
	"log/slog"
	"net/http"
)

//go:embed static
var staticFiles embed.FS

func ServeStatic(w http.ResponseWriter, req *http.Request) *ErrorResponse {
	fs := http.FileServer(http.FS(staticFiles))
	fs.ServeHTTP(w, req)
	return nil
}

func Render(component templ.Component) Handler {
	return func(w http.ResponseWriter, req *http.Request) *ErrorResponse {
		w.Header().Set("Content-Type", "text/html")
		err := component.Render(req.Context(), w)
		if err != nil {
			return &ErrorResponse{Status: http.StatusInternalServerError, Message: err.Error()}
		}
		return nil
	}
}

func RegisterRoutes(config Config, logger *slog.Logger) http.Handler {
	rtr := NewRouter()

	globalRecoverHandler := func(w http.ResponseWriter, req *http.Request, err *ErrorResponse) {
		http.Error(w, err.Message, err.Status)
	}

	rtr.Use(Recoverer(globalRecoverHandler))
	rtr.Use(Logging(logger))
	rtr.Use(Compress(5))

	rtr.Handle("GET", "/static/", ServeStatic)

	rtr.Handle("GET", "/", Render(templates.Home()))

	return rtr
}
