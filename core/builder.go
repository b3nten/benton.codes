package core

import (
	"fmt"
	lua "github.com/yuin/gopher-lua"
	"net/http"
	"os"
	"strings"

	esbuild "github.com/evanw/esbuild/pkg/api"
	"github.com/go-chi/chi/v5"
)

type BuildConfig struct {
	App *App
}

type CachedAsset struct {
	Content  []byte
	MimeType string
}

func AssetMiddleware(app *App) http.HandlerFunc {
	cache := NewCache[CachedAsset]()

	return func(w http.ResponseWriter, r *http.Request) {
		path := chi.URLParam(r, "*")

		// only serve cached assets in production
		// as assets indicate entries and not build artifacts
		if app.Mode == ModeProd && cache.Has(path) {
			asset := cache.Get(path)
			w.Header().Set("Content-Type", asset.MimeType)
			w.Write(asset.Content)
			return
		}

		asset, ok := app.GetAsset(path)

		if !ok {
			// this could be a chunk build from an asset
			if cache.Has(path) {
				asset := cache.Get(path)
				w.Header().Set("Content-Type", asset.MimeType)
				w.Write(asset.Content)
				return
			}
			// or not
			http.Error(w, "Not found", http.StatusNotFound)
			return
		}

		switch asset.Type {
		case "js":
			BuildAsset(w, asset, cache, path)
		case "css":
			BuildAsset(w, asset, cache, path)
		default:
			// todo: use custom handlers
			http.Error(w, "Not found", http.StatusNotFound)
		}
	}
}

func BuildAsset(w http.ResponseWriter, asset Asset, cache *Cache[CachedAsset], path string) {
	values := *asset.Values

	minify := false
	if values.Has("minify") {
		minify = bool(values.Get("minify").(lua.LBool))
	}

	external := make([]string, 0)
	external = append(external, "/static/*")
	externalTable := asset.Values.Get("external")
	if externalTable != nil && externalTable.Type() == lua.LTTable {
		externalValueTable := externalTable.(*lua.LTable)
		externalValueTable.ForEach(func(key, value lua.LValue) {
			external = append(external, value.String())
		})
	}

	result := esbuild.Build(esbuild.BuildOptions{
		EntryPoints: []string{asset.Src},
		Loader: map[string]esbuild.Loader{
			".tsx": esbuild.LoaderTSX,
		},
		External:          external,
		Outdir:            "_assets",
		Bundle:            true,
		Write:             false,
		Format:            esbuild.FormatESModule,
		Target:            esbuild.ES2022,
		Splitting:         true,
		MinifySyntax:      minify,
		MinifyWhitespace:  minify,
		MinifyIdentifiers: minify,
		EntryNames:        "[ext]-[hash]",
		ChunkNames:        "[ext]-[hash]",
		AssetNames:        "[ext]-[hash]",
	})

	if len(result.Errors) > 0 {
		http.Error(w, "Error building", http.StatusInternalServerError)
		fmt.Println(result.Errors)
		return
	}

	if len(result.OutputFiles) == 0 {
		http.Error(w, "Error building", http.StatusInternalServerError)
		return
	}

	for i, file := range result.OutputFiles {
		workDir, _ := os.Getwd()
		var p string
		if i == 0 {
			p = path
		} else {
			p = strings.Replace(file.Path, workDir+"/_assets/", "", 1)
		}
		cache.Set(p, CachedAsset{
			Content:  file.Contents,
			MimeType: mimeFromName(p),
		})
	}

	if asset.Type == "js" {
		w.Header().Set("Content-Type", "application/javascript")
	} else {
		w.Header().Set("Content-Type", "text/css")
	}

	w.Write(result.OutputFiles[0].Contents)
}

func mimeFromName(name string) string {
	ext := strings.Split(name, ".")
	if len(ext) == 0 {
		return ""
	}
	switch ext[len(ext)-1] {
	case "js":
		return "application/javascript"
	case "css":
		return "text/css"
	default:
		return "application/octet-stream"
	}
}
