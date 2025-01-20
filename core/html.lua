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