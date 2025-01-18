package core

import (
	"flag"
	"fmt"

	lua "github.com/yuin/gopher-lua"
)

type Mode string

const (
	ModeDev Mode = "development"
	ModeProd = "production"
)

var mode *Mode

func init() {
	mode = (*Mode)(flag.String("mode", "dev", "The mode to run in"))
}

type App struct {
	Name string
	Mode Mode
	Port int
	JS  map[string]JavascriptEntry
	CSS map[string]CSSEntry
	StaticDir string
}

func (a App) ResolveJavascriptByPath(path string) (JavascriptEntry, bool) {
	var entry JavascriptEntry
	for _, e := range a.JS {
		if e.Src == normalizePath(path) || e.Name == normalizePath(path) {
			entry = e
			return entry, true
		}
	}
	return entry, false
}

func (a App) ResolveCSSByPath(path string) (CSSEntry, bool) {
	var entry CSSEntry
	for _, e := range a.CSS {
		if e.Src == normalizePath(path) || e.Name == normalizePath(path) {
			entry = e
			return entry, true
		}
	}
	return entry, false
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

func LoadApp() *App {
	config := &App{}

	config.Mode = *mode

	L := lua.NewState()
	L.G.Global.RawSet(lua.LString("runtime_mode"), lua.LString(*mode))
	L.G.Global.RawSet(lua.LString("is_dev"), lua.LBool(*mode == ModeDev))
	L.G.Global.RawSet(lua.LString("is_prod"), lua.LBool(*mode == ModeProd))
	L.SetFuncs(L.G.Global, map[string]lua.LGFunction{
		"js": func(L *lua.LState) int {
			L.Push(L.ToTable(1))
			return 1
		},
		"css": func(L *lua.LState) int {
			L.Push(L.ToTable(1))
			return 1
		},
		"app": func(L *lua.LState) int {
			L.G.Global.RawSet(lua.LString("app"), L.ToTable(1))
			return 1
		},
	})
	defer L.Close()
	if err := L.DoFile("app.lua"); err != nil {
		panic(err)
	}

	app := L.G.Global.RawGet(lua.LString("app")).(*lua.LTable)

	if lv := extract[lua.LString](app, "name"); lv != "" {
		config.Name = lv.String()
	} else {
		config.Name = "app"
	}

	if port := extract[lua.LNumber](app, "port"); port != 0 {
		config.Port = int(port)
	} else {
		config.Port = 8000
	}

	if static := extract[lua.LString](app, "static"); static != "" {
		config.StaticDir = normalizePath(static.String())
	} else {
		config.StaticDir = "static"
	}

	js := app.RawGetString("js").(*lua.LTable)
	config.JS = make(map[string]JavascriptEntry)
	js.ForEach(func(a lua.LValue, b lua.LValue) {
		js := b.(*lua.LTable)
		entry := JavascriptEntry{}

		if s := extract[lua.LString](js, "src"); s != "" {
			entry.Src = normalizePath(s.String())
		} else {
			panic(fmt.Sprintf("error building: javascript entry is missing a src"))
		}

		if s := extract[lua.LString](js, "name"); s != "" {
			entry.Name = s.String()
		} else {
			entry.Name = entry.Src
		}

		entry.Bundle = bool(extract[lua.LBool](js, "bundle"))
		entry.Minify = bool(extract[lua.LBool](js, "minify"))

		config.JS[entry.Name] = entry
	})

	css := app.RawGetString("css").(*lua.LTable)
	config.CSS = make(map[string]CSSEntry)
	css.ForEach(func(a lua.LValue, b lua.LValue) {
		css := b.(*lua.LTable)
		entry := CSSEntry{}

		if s := extract[lua.LString](css, "src"); s != "" {
			entry.Src = normalizePath(s.String())
		} else {
			panic(fmt.Sprintf("error building: css entry is missing a src"))
		}

		if s := extract[lua.LString](css, "name"); s != "" {
			entry.Name = s.String()
		} else {
			entry.Name = entry.Src
		}

		config.CSS[entry.Name] = entry
	})

	return config
}

type Asset struct {
	Name string
	Src string
	BuildSrc string
}

type JavascriptEntry struct {
	Asset
	Bundle bool
	Minify bool
}

type CSSEntry struct {
	Asset
	Name string
}

func (a Asset) Path() string {
	if a.BuildSrc != "" {
		return a.BuildSrc
	} else if a.Name != "" {
		return a.Name
	} else {
		return a.Src
	}
}

func normalizePath(s string) string {
	if s[0] == '/' {
		s = s[1:]
	}
	return s
}
