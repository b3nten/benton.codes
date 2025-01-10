package server

import (
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"benton.codes/builder"
	"benton.codes/core"
	"benton.codes/templates"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func NewServer(c *core.Config) http.Handler {
	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Heartbeat("/ping"))
	r.Use(middleware.Compress(5))

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		templates.HomePage().Render(w)
	})

	r.Get("/js/*", builder.JSBuildMiddleware(builder.JSBuilderConfig{
		Directory: "./www/js",
		Cache:     c.Mode == core.ModeProd,
	}))

	workDir, _ := os.Getwd()
	filesDir := http.Dir(filepath.Join(workDir, "www/static"))
	FileServer(r, "/static", filesDir)
	return r
}

func FileServer(r chi.Router, path string, root http.FileSystem) {
	if strings.ContainsAny(path, "{}*") {
		panic("FileServer does not permit any URL parameters.")
	}

	if path != "/" && path[len(path)-1] != '/' {
		r.Get(path, http.RedirectHandler(path+"/", 301).ServeHTTP)
		path += "/"
	}
	path += "*"

	r.Get(path, func(w http.ResponseWriter, r *http.Request) {
		rctx := chi.RouteContext(r.Context())
		pathPrefix := strings.TrimSuffix(rctx.RoutePattern(), "/*")
		fs := http.StripPrefix(pathPrefix, http.FileServer(root))
		fs.ServeHTTP(w, r)
	})
}
