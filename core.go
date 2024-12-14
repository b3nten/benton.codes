package main

import (
	"flag"
	"log/slog"
	"os"
	"time"
)

var isProd bool
var port int

func init() {
	flag.BoolVar(&isProd, "prod", false, "run in production Mode")
	flag.IntVar(&port, "Port", 8001, "Port to run the server on")
	flag.Parse()
}

type Mode string

const (
	ModeDevelopment Mode = "dev"
	ModeProduction  Mode = "prod"
)

type Config struct {
	port    string
	mode    Mode
	timeout time.Duration
}

func GetMode() Mode {
	if isProd {
		return ModeProduction
	} else {
		return ModeDevelopment
	}

}

func NewLogger() *slog.Logger {
	return slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{
		AddSource:   false,
		Level:       slog.LevelDebug,
		ReplaceAttr: nil,
	}))
}
