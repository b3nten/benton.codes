package main

import (
	"embed"
	"html/template"
	"log"
	"log/slog"
	"net/http"
)

//go:embed static
var staticFiles embed.FS

//go:embed templates
var templateFS embed.FS

func LoggerMiddleware() Middleware {
	return func(w http.ResponseWriter, req *http.Request, next NextFunc) *ErrorResponse {
		log.Printf("%s %s", req.Method, req.URL.Path)
		return next()
	}
}

func ErrorMiddleware() Middleware {
	return func(w http.ResponseWriter, req *http.Request, next NextFunc) *ErrorResponse {
		err := next()
		if err != nil {
			w.Header().Set("Content-Type", "text/html")
			w.WriteHeader(err.Status)
			page := "<h1>" + err.Message + "</h1>"
			w.Write([]byte(page))
		}
		return nil
	}
}

type TemplateData struct {
	Title string
	Data  interface{}
}

func NewTemplateHandler(templatePath string) Handler {
	// Parse the template once during initialization
	tmpl := template.Must(template.ParseFS(templateFS, "templates/"+templatePath))

	return func(w http.ResponseWriter, r *http.Request) *ErrorResponse {
		data := TemplateData{
			Title: "Your Page Title",
			Data:  nil,
		}

		err := tmpl.Execute(w, data)

		if err != nil {
			return &ErrorResponse{
				Status:  http.StatusInternalServerError,
				Message: "Failed to render template: " + err.Error(),
			}
		}

		return nil
	}
}

func PingHandler(w http.ResponseWriter, req *http.Request) *ErrorResponse {
	w.Write([]byte("pong"))
	return nil
}

func ServeStatic(w http.ResponseWriter, req *http.Request) *ErrorResponse {
	fs := http.FileServer(http.FS(staticFiles))
	fs.ServeHTTP(w, req)
	return nil
}

func RegisterRoutes(config Config, logger *slog.Logger) http.Handler {
	rtr := NewRouter()

	rtr.Use(ErrorMiddleware())
	rtr.Use(LoggerMiddleware())

	rtr.Handle("GET", "/static/", ServeStatic)

	rtr.Handle("GET", "/{$}", NewTemplateHandler("index.html"))

	rtr.Subrouter("/api", func(r *Router) {
		r.Handle("GET", "/ping", PingHandler)
	})

	return rtr
}
