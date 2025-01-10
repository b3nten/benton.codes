package core

import "flag"

type Mode int

var addr* string
var mode *Mode

const (
	ModeDev Mode = iota
	ModeProd
)

var config *Config

func init() {
	addr = flag.String("addr", ":8000", "The address to listen on")
	mode = (*Mode)(flag.Int("mode", 0, "The mode to run in"))

	config = &Config{
		Addr: *addr,
		Mode: *mode,
	}
}

type Config struct {
	Addr string
	Mode Mode
}

func GetConfig() *Config {
	return config
}
