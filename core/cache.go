package core

type Cache[T any] struct {
	values map[string]T
}

func NewCache[T any]() *Cache[T] {
	return &Cache[T]{
		values: make(map[string]T),
	}
}

func (c Cache[T]) Get(key string) T {
	return c.values[key]
}

func (c Cache[T]) Has(key string) bool {
	_, ok := c.values[key]
	return ok
}

func (c Cache[T]) Set(key string, value T) {
	c.values[key] = value
}
