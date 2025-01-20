package core

import (
	"fmt"
	lua "github.com/yuin/gopher-lua"
	luajson "layeh.com/gopher-json"
)

type LuaTable map[string]interface{}
type LuaArray []interface{}

func unwrapTable(t LuaTable) *lua.LTable {
	l := &lua.LTable{}
	for k, v := range t {
		switch val := v.(type) {
		case string:
			l.RawSetString(k, lua.LString(val))
		case int:
			l.RawSetString(k, lua.LNumber(val))
		case int64:
			l.RawSetString(k, lua.LNumber(val))
		case float64:
			l.RawSetString(k, lua.LNumber(val))
		case bool:
			l.RawSetString(k, lua.LBool(val))
		case LuaTable:
			l.RawSetString(k, unwrapTable(val))
		case LuaArray:
			fmt.Println("GOT AN ARRAY")
			arrayTable := &lua.LTable{}
			for i, item := range val {
				arrayTable.RawSetInt(i+1, unwrapValue(item))
			}
			l.RawSetString(k, arrayTable)
		case nil:
			l.RawSetString(k, lua.LNil)
		default:
			l.RawSetString(k, lua.LNil)
		}
	}
	return l
}

func unwrapValue(v interface{}) lua.LValue {
	switch val := v.(type) {
	case string:
		return lua.LString(val)
	case int:
		return lua.LNumber(val)
	case int64:
		return lua.LNumber(val)
	case float64:
		return lua.LNumber(val)
	case bool:
		return lua.LBool(val)
	case LuaTable:
		return unwrapTable(val)
	case LuaArray:
		arrayTable := &lua.LTable{}
		for i, item := range val {
			arrayTable.RawSetInt(i+1, unwrapValue(item))
		}
		return arrayTable
	case nil:
		return lua.LNil
	default:
		return lua.LNil
	}
}

type LuaRouteResponse struct {
	Status  int
	Head    string
	Body    string
	Title   string
	Headers map[string]string
	Shell   bool
}

func ServeLuaTemplate(path string, ctx LuaTable) LuaRouteResponse {
	l := NewLStateWithContext()
	luajson.Preload(l)

	// register HTML globals
	err := l.DoFile("core/html.lua")
	if err != nil {
		panic(err)
	}
	// register the context
	err = l.DoString(`
		_G["response"] = {
    		status = 200,
    		statusText = "",
    		headers = {},
		}
		_G["shell"] = function(tab) 
			tab.__is_shell = true
			return tab
		end
	`)

	if err != nil {
		panic(err)
	}

	l.SetGlobal("data", unwrapTable(ctx))

	// Run user script
	err = l.DoFile(path)
	if err != nil {
		panic(err)
	}
	// Parse the response
	err = l.DoString(`
		local json = require("json")
		local function responseSwitch(response)
		    if type(response.body) == "table" and response.body.__tag then
		        response.body = __internal_html_render(response.body)
		        response.headers["Content-Type"] = "text/html"
			elseif type(response.body) == "table" and response.body.__is_shell then
				response.__is_shell = true
				response.title = response.body.title
		        response.body = __internal_html_render(response.body.body)
		        response.head = __internal_html_render(response.body.head)
				response.headers["Content-Type"] = "text/html"
		    elseif type(response.body) == "table" then
		        response.headers["Content-Type"] = "application/json"
				response.body = json.encode(response.body)
		    elseif type(response.body) == "string" then
		        response.headers["Content-Type"] = "text/plain"
		    end
		end
		responseSwitch(response)
	`)
	if err != nil {
		panic(err)
	}

	response := LuaRouteResponse{}
	response.Headers = make(map[string]string)

	res := l.G.Global.RawGetString("response").(*lua.LTable)
	headers := res.RawGetString("headers").(*lua.LTable)

	//w.WriteHeader(int(res.RawGetString("status").(lua.LNumber)))
	response.Status = int(res.RawGetString("status").(lua.LNumber))

	headers.ForEach(func(k, v lua.LValue) {
		response.Headers[k.String()] = v.String()
	})

	if res.RawGetString("__is_shell") != lua.LNil {
		response.Body = res.RawGetString("body").String()
		response.Head = res.RawGetString("head").String()
		response.Title = res.RawGetString("title").String()
	} else {
		response.Body = res.RawGetString("body").String()
	}

	return response
}
