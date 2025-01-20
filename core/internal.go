package core

import (
	"flag"
	"strings"

	lua "github.com/yuin/gopher-lua"
)

type Mode string

var mode *Mode

const (
	ModeDev  Mode = "development"
	ModeProd Mode = "production"
)

func preInit() {
	mode = (*Mode)(flag.String("mode", "development", "The mode to run in"))
	flag.Parse()
}

func typedTable(t string) func(state *lua.LState) int {
	return func(state *lua.LState) int {
		tab := state.ToTable(1)
		tab.RawSetString("type", lua.LString(t))
		state.Push(tab)
		return 1
	}
}

func createAppFromConfig() (*App, *lua.LTable) {
	app := &App{}
	app.Mode = *mode
	app.Assets = make(map[string]Asset)
	app.Routes = make([]Route, 0)

	L := lua.NewState()
	L.G.Global.RawSet(lua.LString("runtime_mode"), lua.LString(*mode))
	L.G.Global.RawSet(lua.LString("is_dev"), lua.LBool(*mode == ModeDev))
	L.G.Global.RawSet(lua.LString("is_prod"), lua.LBool(*mode == ModeProd))
	L.SetFuncs(L.G.Global, map[string]lua.LGFunction{
		"asset": typedTable("asset"),
		"js":    typedTable("js"),
		"css":   typedTable("css"),
		"lua":   typedTable("lua"),
		"app": func(L *lua.LState) int {
			L.G.Global.RawSet(lua.LString("app"), L.ToTable(1))
			return 1
		},
	})
	defer L.Close()
	if err := L.DoFile("app.lua"); err != nil {
		panic(err)
	}

	config := L.G.Global.RawGet(lua.LString("app")).(*lua.LTable)

	if lv := extract[lua.LString](config, "name"); lv != "" {
		app.Name = lv.String()
	} else {
		app.Name = "app"
	}

	if port := extract[lua.LNumber](config, "port"); port != 0 {
		app.Port = int(port)
	} else {
		app.Port = 8000
	}

	if static := extract[lua.LString](config, "static_dir"); static != "" {
		app.StaticDir = strings.Trim(static.String(), "/")
	} else {
		app.StaticDir = "static"
	}

	compileAssets(app, config.RawGetString("assets").(*lua.LTable))

	if routes := extract[lua.LValue](config, "routes"); routes != lua.LNil {
		_routes := routes.(*lua.LTable)
		_routes.ForEach(func(k, v lua.LValue) {
			if route, ok := v.(*lua.LTable); ok {
				path := extract[lua.LString](route, "path")
				handler := extract[lua.LString](route, "handler")
				if path != "" && handler != "" {
					app.Routes = append(app.Routes, Route{path.String(), handler.String()})
				}
			}
		})
	}

	return app, config
}

func extract[T lua.LValue](lval *lua.LTable, key string) T {
	if lv := lval.RawGetString(key); lv != nil {
		if val, ok := lv.(T); ok {
			return val
		}
	}
	var zero T
	return zero
}
