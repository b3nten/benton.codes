package builder

import (
	"fmt"
	"net/http"

	"benton.codes/core"
	esbuild "github.com/evanw/esbuild/pkg/api"
	"github.com/go-chi/chi/v5"
)

type JSBuilderConfig struct {
	App *core.App
}

func JSBuildMiddleware(cfg JSBuilderConfig) http.HandlerFunc {
	cache := newCache()

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		path := chi.URLParam(r, "*")

		if cache.has(path) && (cfg.App.Mode != core.ModeDev || !keyExists(cfg.App.JS, path)) {
			w.Header().Set("Content-Type", "application/javascript")
			w.Write(cache.get(path))
			return
		}

		asset, ok := cfg.App.ResolveJavascriptByPath(path)

		if !ok {
			http.Error(w, "Error building JS", http.StatusInternalServerError)
			fmt.Println("Path not found")
			return
		}

		result := esbuild.Build(esbuild.BuildOptions{
			EntryPoints: []string{asset.Src},
			Loader: map[string]esbuild.Loader{
				".tsx": esbuild.LoaderTSX,
			},
			Bundle:            asset.Bundle,
			Write:             false,
			Format:            esbuild.FormatESModule,
			Target:            esbuild.ES2022,
			MinifySyntax:      asset.Minify,
			MinifyWhitespace:  asset.Minify,
			MinifyIdentifiers: asset.Minify,
			EntryNames:        "__js/[name]-[hash]",
			ChunkNames:        "__js/chunks/[hash]",
			AssetNames:        "__js/assets/[hash]",
		})

		if len(result.Errors) > 0 {
			http.Error(w, "Error building JS", http.StatusInternalServerError)
			fmt.Println(result.Errors)
			return
		}

		for _, v := range result.OutputFiles {
			cache.set(v.Path, v.Contents)
		}

		w.Header().Set("Content-Type", "application/javascript")
		w.Write(result.OutputFiles[0].Contents)
	})
}

func CSSBuildMiddleware(cfg JSBuilderConfig) http.HandlerFunc {
	cache := newCache()

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		path := chi.URLParam(r, "*")

		if cache.has(path) && (cfg.App.Mode != core.ModeDev || !keyExists(cfg.App.JS, path)) {
			w.Header().Set("Content-Type", "text/css")
			w.Write(cache.get(path))
			return
		}


		asset, ok := cfg.App.ResolveCSSByPath(path)
		fmt.Println(path, asset, ok, cfg.App.CSS)

		if !ok {
			http.Error(w, "Error building JS", http.StatusInternalServerError)
			fmt.Println("Path not found")
			return
		}

		result := esbuild.Build(esbuild.BuildOptions{
			EntryPoints: []string{asset.Src},
			Write:             false,
			Format:            esbuild.FormatESModule,
			Target:            esbuild.ES2022,
			EntryNames:        "__css/[name]-[hash]",
			ChunkNames:        "__css/chunks/[hash]",
			AssetNames:        "__css/assets/[hash]",
		})

		if len(result.Errors) > 0 {
			http.Error(w, "Error building CSS", http.StatusInternalServerError)
			fmt.Println(result.Errors)
			return
		}

		for _, v := range result.OutputFiles {
			cache.set(v.Path, v.Contents)
		}

		w.Header().Set("Content-Type", "text/css")
		w.Write(result.OutputFiles[0].Contents)
	})
}

func keyExists[V any](myMap map[string]V, key string) bool {
	_, exists := myMap[key]
	return exists
}
