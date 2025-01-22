package core

import (
	"fmt"
	lua "github.com/yuin/gopher-lua"
	luajson "layeh.com/gopher-json"
)

type LuaTable map[string]interface{}

type LuaArray []interface{}

type LuaRouteResponse struct {
	Status  int
	Head    string
	Body    string
	Title   string
	Headers map[string]string
	Shell   bool
}

func NewLStateWithContext() *lua.LState {
	L := lua.NewState()
	L.G.Global.RawSet(lua.LString("runtime_mode"), lua.LString(*mode))
	L.G.Global.RawSet(lua.LString("is_dev"), lua.LBool(*mode == ModeDev))
	L.G.Global.RawSet(lua.LString("is_prod"), lua.LBool(*mode == ModeProd))
	return L
}

func ServeLuaTemplate(path string, ctx LuaTable) LuaRouteResponse {
	l := NewLStateWithContext()
	luajson.Preload(l)

	// register HTML globals
	err := l.DoString(luaHtml)
	if err != nil {
		panic(err)
	}
	// register the context
	err = l.DoString(
		`
		_G["response"] = {
    		status = 200,
    		statusText = "",
    		headers = {},
		}
		_G["shell"] = function(tab) 
			tab.__is_shell = true
			return tab
		end
	`,
	)

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
	err = l.DoString(
		`
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
	`,
	)
	if err != nil {
		panic(err)
	}

	response := LuaRouteResponse{}
	response.Headers = make(map[string]string)

	res := l.G.Global.RawGetString("response").(*lua.LTable)
	headers := res.RawGetString("headers").(*lua.LTable)

	//w.WriteHeader(int(res.RawGetString("status").(lua.LNumber)))
	response.Status = int(res.RawGetString("status").(lua.LNumber))

	headers.ForEach(
		func(k, v lua.LValue) {
			response.Headers[k.String()] = v.String()
		},
	)

	if res.RawGetString("__is_shell") != lua.LNil {
		response.Body = res.RawGetString("body").String()
		response.Head = res.RawGetString("head").String()
		response.Title = res.RawGetString("title").String()
	} else {
		response.Body = res.RawGetString("body").String()
	}

	return response
}

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

var luaHtml = `
local mod = { }

local SELF_CLOSING_TAGS = {
	area = true,
	base = true,
	col = true,
	embed = true,
	param = true,
	source = true,
	track = true,
	wbr = true,
    img = true,
    input = true,
    br = true,
    hr = true,
    meta = true,
    link = true,
}

local BOOLEAN_ATTRIBUTES = {
    allowfullscreen = true,
    async = true,
    autofocus = true,
    autoplay = true,
    checked = true,
    controls = true,
    default = true,
    defer = true,
    disabled = true,
    formnovalidate = true,
    inert = true,
    ismap = true,
	itemscope = true,
	loop = true,
	multiple = true,
	muted = true,
	nomodule = true,
	novalidate = true,
	open = true,
	playsinline = true,
	readonly = true,
	required = true,
	reversed = true,
	selected = true,
	shadowrootclonable = true,
	shadowrootdelegatesfocus = true,
	shadowrootserializable = true,
}

local function escape_html(str)
    local escape_patterns = {
        ['&'] = '&amp;',
        ['<'] = '&lt;',
        ['>'] = '&gt;',
        ['"'] = '&quot;',
        ["'"] = '&#39;'
    }
    return str:gsub('[&<>"\']', escape_patterns)
end

local function camel_to_kebab(str)
    return str:gsub("%u", function(c) return "-" .. c:lower() end)
end

local function parseStyles(style)
    local str = ""
    for i, v in pairs(style) do
        str = str .. camel_to_kebab(i) .. ":" .. v .. ";"
    end
    return escape_html(str)
end

local function renderPrimitive(element, indentLevel)
	indentLevel = indentLevel or 0

	if type(element) == "table" and element.__unsafe == true then
    	return element.str
    end
	if type(element) == "string" then
		return escape_html(element)
	elseif type(element) == "number" then
		return element
	elseif type(element) == "boolean" then
		return ""
	elseif type(element) == "table" and not element.__tag then
		local html = ""
		for _, v in pairs(element) do
			html = html .. renderPrimitive(v, indentLevel)
		end
		return html
	elseif type(element) == "table" and element.__tag then
		return mod.render(element, indentLevel)
	else
		return ""
	end
end

local tags = {
    "div", "span", "p", "a", "button", "input", "img", "form",
    "h1", "h2", "h3", "h4", "h5", "h6",
    "ul", "ol", "li",
    "table", "tr", "td", "th",
    "section", "header", "footer", "aside", "article", "nav",
    "main", "aside", "figure", "figcaption",
    "label", "select", "option", "textarea",
    "strong", "em", "i", "b", "u", "s", "small", "sub", "sup",
    "br", "hr", "meta", "link",
    "iframe", "video", "audio", "source", "track",
    "head", "body", "title", "style", "script",
    "stylesheet", "module", "importmap"
}

function mod.render(element, indentLevel)
	indentLevel = indentLevel or 0
    local indent = string.rep("\t", indentLevel)

    if type(element) == "table" and element.__unsafe == true then
    	return element.str
    end

    if type(element) ~= "table" or not element.__tag then
        return indent .. renderPrimitive(element)
    end

    local html = indent .. "<" .. element.__tag

    -- Add attributes
    for k, v in pairs(element) do
        if k == "style" and type(v) == "table" then
            html = html .. string.format(' %s="%s"', k, parseStyles(v))
        elseif type(k) == "string" and k ~= "__tag" and type(v) ~= "table" then
            if BOOLEAN_ATTRIBUTES[k] and v == true then
                html = html .. " " .. k
            elseif not BOOLEAN_ATTRIBUTES[k] then
                html = html .. string.format(' %s="%s"', camel_to_kebab(k), escape_html(v))
            end
        end
    end

    if SELF_CLOSING_TAGS[element.__tag] then
        return html .. "/>\n"
    end

    html = html .. ">\n"

    for k, v in pairs(element) do
        if type(v) == "table" then
            html = html .. mod.Render(v, indentLevel + 1)
        elseif k ~= "__tag" and type(k) == "number" then
            html = html .. indent .. "\t" .. escape_html(tostring(v)) .. "\n"
        end
    end

    html = html .. indent .. "</" .. element.__tag .. ">\n"
    return html
end

function mod.when(condition, element)
    return condition and element or nil
end

function mod.unless(condition, element)
    return not condition and element or nil
end

function mod.switch(value, cases)
    return cases[value] or cases.default
end

function mod.unsafe(str)
	return { __unsafe = true, str = str }
end

function mod.createElementFactory(tag)
    return function(props)
        local obj = { __tag = tag }

        if tag == "stylesheet" then
			obj.__tag = "link"
			obj.rel = "stylesheet"
			obj.type = "text/css"
			obj.href = props
			return obj
		end

		if tag == "module" then
			obj.__tag = "script"
			obj.type = "module"
			obj.src = props
			return obj
		end

		if tag == "importmap" then
			obj.__tag = "script"
			obj.type = "importmap"
			obj.src = mod.unsafe(props)
			return obj
		end

        if type(props) ~= "table" then
			obj[1] = props
			return obj
		end

		if tag == "h1" and props.level then
			obj.__tag = "h" .. props.level
		end

        for k, v in pairs(props) do
			obj[k] = v
		end

        return obj
    end
end

function mod.element(tag)
    return function (props)
        return mod.createElementFactory(tag)(props)
    end
end

for _, tag in ipairs(tags) do
	mod[tag] = mod.createElementFactory(tag)
	_G[tag] = mod[tag]
end

_G["when"] = mod.when
_G["unless"] = mod.unless
_G["switch"] = mod.switch
_G["unsafe"] = mod.unsafe
_G["element"] = mod.element
_G["__internal_html_render"] = mod.render

`
