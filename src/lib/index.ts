export function state<This, T>(
	_: ClassAccessorDecoratorTarget<This, T>,
	context: ClassAccessorDecoratorContext<This, T>,
): ClassAccessorDecoratorResult<This, T> {
	if (!context || context.kind !== "accessor")
		throw Error("Invalid decorator usage of @state!");
	return {
		get(): T {
			// @ts-expect-error
			return this.__state_internal[context.name];
		},
		set(val: T) {
			// @ts-expect-error
			this.__state_internal[context.name] = val;
		},
		init(initial: T) {
			// @ts-expect-error
			this.__state_internal[context.name] = initial;
			return initial;
		},
	};
}
