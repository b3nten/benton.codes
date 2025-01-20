package core

import "fmt"

func init() {
	preInit()
	// add your init code here
}

type Route struct {
	Path    string
	Handler string
}

type App struct {
	// required fields
	Name      string
	Mode      Mode
	Port      int
	Assets    map[string]Asset
	StaticDir string
	Routes    []Route
	// add your custom context here
}

func LoadFromConfig() *App {
	app, config := createAppFromConfig()

	// add your custom context here
	fmt.Println("loaded config", config.RawGetString("name").String(), "in mode", app.Mode)

	return app
}
