package core

import (
	"fmt"
	"github.com/yuin/gopher-lua"
	"io"
	"os"
	"strings"
)

type LValueMap map[string]lua.LValue

func (vm LValueMap) Get(key string) lua.LValue {
	if value, ok := vm[key]; ok {
		return value
	}
	var zero lua.LValue
	return zero
}

func (vm LValueMap) Has(key string) bool {
	_, ok := vm[key]
	return ok
}

func (vm LValueMap) Set(key string, value lua.LValue) {
	vm[key] = value
}

type Asset struct {
	Name     string
	Src      string
	BuildSrc string
	Type     string
	Mime     string
	Values   *LValueMap
}

func (app *App) GetAsset(nameOrSrc string) (Asset, bool) {
	asset, ok := app.Assets[nameOrSrc]
	if ok {
		return asset, ok
	}
	if app.Mode == ModeDev {
		for _, asset := range app.Assets {
			if asset.Src == nameOrSrc {
				return asset, true
			}
		}
	} else {
		for _, asset := range app.Assets {
			if asset.BuildSrc == nameOrSrc {
				return asset, true
			}
		}
		for _, asset := range app.Assets {
			if asset.Src == nameOrSrc {
				return asset, true
			}
		}
	}
	return Asset{}, false
}

func (app *App) GetAssetPath(nameOrSrc string) string {
	asset, ok := app.GetAsset(nameOrSrc)
	fmt.Println(asset)
	if !ok {
		return ""
	}
	if app.Mode == ModeDev || asset.BuildSrc == "" {
		return "/_assets/" + asset.Name
	} else {
		return asset.BuildSrc
	}
}

func compileAssets(app *App, assets *lua.LTable) {

	manifest := make(map[string]string)

	if app.Mode == ModeProd {
		file, err := os.Open("__immutable/manifest.txt")
		if err == nil {
			manifestBuffer, _ := io.ReadAll(file)
			manifestStr := ""
			manifestStr = string(manifestBuffer)

			manifestLines := strings.Split(manifestStr, "\n")
			for _, line := range manifestLines {
				if line == "" {
					continue
				}
				parts := strings.Split(line, " > ")
				manifest[parts[0]] = parts[1]
			}
		}
	}

	assets.ForEach(func(_ lua.LValue, entry lua.LValue) {
		if entry.Type() != lua.LTTable {
			return
		}

		table := entry.(*lua.LTable)

		values := make(LValueMap)

		asset := Asset{
			Values: &values,
		}

		table.ForEach(func(key lua.LValue, value lua.LValue) {
			if key.Type() != lua.LTString {
				return
			}

			key = lua.LString(key.String())

			switch key.String() {
			case "name":
				asset.Name = value.String()
			case "src":
				asset.Src = value.String()
			case "type":
				asset.Type = value.String()
			case "mime":
				asset.Mime = value.String()
			default:
				values[key.String()] = value
			}
		})

		if app.Mode == ModeProd {
			if val, ok := manifest[asset.Src]; ok {
				asset.BuildSrc = val
			} else if val, ok := manifest[asset.Name]; ok {
				asset.BuildSrc = val
			}
		}

		if asset.Src == "" {
			panic(fmt.Sprintf("asset %s Has no src", asset.Name))
		}

		if asset.Name == "" {
			asset.Name = asset.Src
		}

		if asset.Mime == "" {
			switch asset.Type {
			case "js":
				asset.Mime = "application/javascript"
			case "css":
				asset.Mime = "text/css"
			default:
				asset.Mime = "application/octet-stream"
			}
		}

		app.Assets[asset.Name] = asset
	})
}
