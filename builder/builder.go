package builder

import (
	"fmt"
	"net/http"
	"strings"

	esbuild "github.com/evanw/esbuild/pkg/api"
	"github.com/go-chi/chi/v5"
)

type JSBuilderConfig struct {
	Directory string
	Cache     bool
}

func JSBuildMiddleware(cfg JSBuilderConfig) http.HandlerFunc {
	if !strings.HasSuffix(cfg.Directory, "/") {
		cfg.Directory += "/"
	}

	cache := NewCache()
	cache.Enabled = cfg.Cache

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		path := chi.URLParam(r, "*")

		if cache.Has(path) {
			w.Header().Set("Content-Type", "application/javascript")
			w.Write(cache.Get(path))
			return
		}

		fmt.Println("Building JS", cfg.Directory+path)

		result := esbuild.Build(esbuild.BuildOptions{
			EntryPoints: []string{cfg.Directory + path},
			Loader: map[string]esbuild.Loader{
				".tsx": esbuild.LoaderTSX,
			},
			Bundle: true,
			Write:  false,
			Format: esbuild.FormatESModule,
			Target: esbuild.ES2022,
			Alias: map[string]string{
				"global": "./www/js/include/global.ts",
			},
			MinifySyntax: true,
			MinifyWhitespace: true,
			MinifyIdentifiers: true,
		})

		if len(result.Errors) > 0 {
			http.Error(w, "Error building JS", http.StatusInternalServerError)
			fmt.Println(result.Errors)
			return
		}

		cache.Set(path, result.OutputFiles[0].Contents)

		w.Header().Set("Content-Type", "application/javascript")
		w.Write(result.OutputFiles[0].Contents)
	})
}

var cachefspath = "buildercache"

type Cache struct {
	Enabled bool
	Values  map[string][]byte
}

func NewCache() *Cache {
	return &Cache{
		Enabled: false,
		Values:  make(map[string][]byte),
	}
}

func (c Cache) Get(key string) []byte {
	if !c.Enabled {
		return nil
	}
	return c.Values[key]
}

func (c Cache) Has(key string) bool {
	if !c.Enabled {
		return false
	}
	_, ok := c.Values[key]
	return ok
}

func (c Cache) Set(key string, value []byte) {
	if !c.Enabled {
		return
	}
	c.Values[key] = value
}
