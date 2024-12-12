package main

import (
	"net/http"
	"strings"
)

type ErrorResponse struct {
	Message string
	Status  int
}

type NextFunc func() *ErrorResponse

type Handler func(http.ResponseWriter, *http.Request) *ErrorResponse

type Middleware func(w http.ResponseWriter, req *http.Request, next NextFunc) *ErrorResponse

type Router struct {
	middlewares []Middleware
	mux         *http.ServeMux
	prefix      string
}

func NewRouter() *Router {
	return &Router{
		mux: http.NewServeMux(),
	}
}

func (r *Router) Use(middleware Middleware) {
	r.middlewares = append(r.middlewares, middleware)
}

func (r *Router) Handle(method string, pattern string, handler Handler) {
	if !strings.HasPrefix(pattern, "/") {
		pattern = "/" + pattern
	}

	h := func(w http.ResponseWriter, req *http.Request) *ErrorResponse {
		return handler(w, req)
	}

	for i := len(r.middlewares) - 1; i >= 0; i-- {
		hh := h
		middleware := r.middlewares[i]
		h = func(w http.ResponseWriter, req *http.Request) *ErrorResponse {
			return middleware(w, req, func() *ErrorResponse {
				return hh(w, req)
			})
		}
	}

	r.mux.HandleFunc(method+" "+r.prefix+pattern, func(w http.ResponseWriter, req *http.Request) {
		if err := h(w, req); err != nil {
			http.Error(w, err.Message, err.Status)
		}
	})
}

func (r *Router) Subrouter(prefix string, fn func(router *Router)) {
	subrtr := &Router{
		mux:         r.mux,
		prefix:      r.prefix + prefix,
		middlewares: make([]Middleware, len(r.middlewares)),
	}

	copy(subrtr.middlewares, r.middlewares)

	fn(subrtr)

	r.mux.Handle(prefix+"/", http.StripPrefix(prefix, subrtr))
}

func (r *Router) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	r.mux.ServeHTTP(w, req)
}
