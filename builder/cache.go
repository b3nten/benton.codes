package builder

var cachefspath = "buildercache"

type cache struct {
	values  map[string][]byte
}

func newCache() *cache {
	return &cache{
		values:  make(map[string][]byte),
	}
}

func (c cache) get(key string) []byte {
	return c.values[key]
}

func (c cache) has(key string) bool {
	_, ok := c.values[key]
	return ok
}

func (c cache) set(key string, value []byte) {
	c.values[key] = value
}
