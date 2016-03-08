function validateOutput(output, keys, scope) {
	var newOutput
	if (typeof output !== 'object') {
		newOutput = {}
	} else {
		newOutput = Object.assign({}, output)
	}

	let { summary } = newOutput
	if (typeof summary !== 'string') {
		newOutput.summary = ''
	}

	let { fields } = newOutput
	if (typeof fields !== 'object') {
		newOutput.fields = {}
	}

	if (typeof newOutput.hasError !== 'boolean') {
		newOutput.hasError = false
	}

	if (typeof newOutput.scope !== 'object') {
		newOutput.scope = {}
	}

	if (typeof newOutput.scope[scope] !== 'boolean') {
		newOutput.scope[scope] = false
	}

	for (var key in keys) {
		newOutput.fields[key] = []
	}

	return newOutput
}

export function isBlank(target, output, keys, scope) {
	let newOutput = validateOutput(output, keys, scope)

	if (typeof target !== 'object') {
		return newOutput
	}

	const originalHasError = newOutput.hasError
	const originalScopeHasError = newOutput.scope[scope]
	for (var key in keys) {
		const prop = target[key]
		const isBlank = (typeof prop !== 'string' || prop.length === 0)
		const error = isBlank ?  [keys[key], 'cannot be blank.'].join(' ') : false
		if (error !== false) {
			newOutput.fields[key].push(error)
			newOutput.summary = [newOutput.summary, error].join(' ')
			newOutput.scope[scope] = originalScopeHasError || true
			newOutput.hasError = originalHasError || true
		}
	}
	return newOutput
	// return mergeApiErrors(target, newOutput, keys, scope)
}

export function mergeApiErrors(target, output, keys, scope) {
	let newOutput = validateOutput(output, keys, scope)

	const errors = target.api_errors
	if (Array.isArray(errors) && errors.length > 0) {

	} else {
		return newOutput
	}
}
