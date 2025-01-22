package server

import (
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"benton.codes/templates"
	. "maragu.dev/gomponents"

	"benton.codes/core"
	"benton.codes/routes"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

type PostData struct {
	Title       string
	Header      string
	Description string
	Content     string
}

// All your routing usually happens here
func registerRoutes(app *core.App, r *chi.Mux) {
	registerLuaRoutes(app, r)

	r.Get(
		"/", func(w http.ResponseWriter, r *http.Request) {
			routes.HomePage(app).Render(w)
		},
	)

	r.Get(
		"/p/*", func(w http.ResponseWriter, r *http.Request) {
			fragment := r.Header.Get("X-Fragment") == "true"
			path := chi.URLParam(r, "*")
			routes.HomePostPage(app, w, path, fragment)
		},
	)

	r.NotFound(
		func(w http.ResponseWriter, r *http.Request) {
			w.WriteHeader(404)
			routes.HomeNotFound(app).Render(w)
		},
	)
}

func registerMiddleware(app *core.App, r *chi.Mux) {
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Heartbeat("/ping"))
	r.Use(middleware.Compress(5))
}

func registerLuaRoutes(app *core.App, r *chi.Mux) {
	for _, route := range app.Routes {
		r.Get(
			route.Path, func(w http.ResponseWriter, r *http.Request) {
				res := core.ServeLuaTemplate(route.Handler, core.LuaTable{})

				w.WriteHeader(res.Status)

				for key, value := range res.Headers {
					w.Header().Set(key, value)
				}

				if res.Shell {
					templates.Shell(
						app,
						res.Title,
						[]Node{Raw(res.Head)},
						[]Node{Raw(res.Body)},
					).Render(w)
					return
				}

				w.Write([]byte(res.Body))
			},
		)
	}
}

func registerAssets(app *core.App, r *chi.Mux) {
	workDir, _ := os.Getwd()

	// serve on demand builder route
	{
		r.Get("/_assets/*", core.AssetMiddleware(app))
	}

	// serve static dir
	{
		filesDir := http.Dir(filepath.Join(workDir, app.StaticDir))
		fileServer(r, "/static", filesDir)
	}

	// If prod a build_immutable directory will exist
	// this is where build assets live
	{
		if _, err := os.Stat(filepath.Join(workDir, "__immutable")); err == nil {
			root := http.Dir(filepath.Join(workDir, "__immutable"))
			fileServer(r, "/__immutable", root)
		}
	}
}

func NewServer(app *core.App) http.Handler {
	r := chi.NewRouter()
	registerMiddleware(app, r)
	registerAssets(app, r)
	registerRoutes(app, r)
	return r
}

func fileServer(r chi.Router, path string, root http.FileSystem) {
	if strings.ContainsAny(path, "{}*") {
		panic("FileServer does not permit any URL parameters.")
	}

	if path != "/" && path[len(path)-1] != '/' {
		r.Get(path, http.RedirectHandler(path+"/", 301).ServeHTTP)
		path += "/"
	}
	path += "*"

	r.Get(
		path, func(w http.ResponseWriter, r *http.Request) {
			rctx := chi.RouteContext(r.Context())
			pathPrefix := strings.TrimSuffix(rctx.RoutePattern(), "/*")
			fs := http.StripPrefix(pathPrefix, http.FileServer(root))
			fs.ServeHTTP(w, r)
		},
	)
}
