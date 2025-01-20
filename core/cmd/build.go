package main

import (
	"benton.codes/core"
	"fmt"
	esbuild "github.com/evanw/esbuild/pkg/api"
	lua "github.com/yuin/gopher-lua"
	"os"
	"strings"
)

func main() {
	app := core.LoadFromConfig()

	// create manifest file

	if _, err := os.Stat("__immutable"); err == nil {
		err := os.RemoveAll("__immutable")
		if err != nil {
			panic(err)
			return
		}
	}

	err := os.MkdirAll("__immutable", os.ModePerm)

	if err != nil {
		panic(err)
		return
	}

	manifest, err := os.Create("__immutable/manifest.txt")

	defer manifest.Close()

	if err != nil {
		panic(err)
		return
	}

	for _, asset := range app.Assets {

		split := asset.Values.Has("split") && bool(asset.Values.Get("split").(lua.LBool))
		minify := asset.Values.Has("minify") && bool(asset.Values.Get("minify").(lua.LBool))

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
			Outdir:            "__immutable",
			Bundle:            true,
			Write:             true,
			Format:            esbuild.FormatESModule,
			Target:            esbuild.ES2022,
			Splitting:         split,
			MinifySyntax:      minify,
			MinifyWhitespace:  minify,
			MinifyIdentifiers: minify,
			EntryNames:        "[ext]-[hash]",
			ChunkNames:        "[ext]-[hash]",
			AssetNames:        "[ext]-[hash]",
		})

		if len(result.Errors) > 0 {
			fmt.Println(result.Errors)
			return
		}

		if len(result.OutputFiles) == 0 {
			return
		}

		workDir, _ := os.Getwd()

		for _, file := range result.OutputFiles {
			path := strings.Replace(file.Path, workDir, "", 1)
			manifest.WriteString(asset.Name + " > " + path + "\n")
		}
	}

	fmt.Println("Build complete")
}
