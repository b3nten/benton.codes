package core

import (
	"bufio"
	lua "github.com/yuin/gopher-lua"
	"github.com/yuin/gopher-lua/parse"
	"os"
)

func NewLStateWithContext() *lua.LState {
	L := lua.NewState()
	L.G.Global.RawSet(lua.LString("runtime_mode"), lua.LString(*mode))
	L.G.Global.RawSet(lua.LString("is_dev"), lua.LBool(*mode == ModeDev))
	L.G.Global.RawSet(lua.LString("is_prod"), lua.LBool(*mode == ModeProd))
	return L
}

// CompileLua reads the passed lua file from disk and compiles it.
func CompileLua(filePath string) (*lua.FunctionProto, error) {
	file, err := os.Open(filePath)
	defer file.Close()
	if err != nil {
		return nil, err
	}
	reader := bufio.NewReader(file)
	chunk, err := parse.Parse(reader, filePath)
	if err != nil {
		return nil, err
	}
	proto, err := lua.Compile(chunk, filePath)
	if err != nil {
		return nil, err
	}
	return proto, nil
}

// DoCompiledFile takes a FunctionProto, as returned by CompileLua, and runs it in the LState. It is equivalent
// to calling DoFile on the LState with the original source file.
func DoCompiledFile(L *lua.LState, proto *lua.FunctionProto) error {
	lfunc := L.NewFunctionFromProto(proto)
	L.Push(lfunc)
	return L.PCall(0, lua.MultRet, nil)
}

//// Example shows how to share the compiled byte code from a lua script between multiple VMs.
//func Example() {
//	codeToShare, err := CompileLua("mylua.lua")
//	if err != nil {
//		panic(err)
//	}
//	a := lua.NewState()
//	b := lua.NewState()
//	c := lua.NewState()
//	DoCompiledFile(a, codeToShare)
//	DoCompiledFile(b, codeToShare)
//	DoCompiledFile(c, codeToShare)
//}
