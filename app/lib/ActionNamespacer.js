export function ActionNamespacer(namespace, actions, delimiter = '/') {
	var o = {}
	for (var action of actions) {
		const key = [namespace, delimiter, action].join()
		o[key] = action 
	}
	return o
}