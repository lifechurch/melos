function validateOutput(output, keys, scope) {
	let newOutput
	if (typeof output !== 'object') {
		newOutput = {}
	} else {
		newOutput = Object.assign({}, output)
	}

	const { summary } = newOutput
	if (typeof summary !== 'string') {
		newOutput.summary = ''
	}

	const { fields } = newOutput
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

	for (const key in keys) {
		newOutput.fields[key] = []
	}

	return newOutput
}

export function isBlank(target, output, keys, scope) {
	const newOutput = validateOutput(output, keys, scope)

	if (typeof target !== 'object') {
		return newOutput
	}

	const originalHasError = newOutput.hasError
	const originalScopeHasError = newOutput.scope[scope]
	newOutput.hasError = false
	for (const key in keys) {
		const prop = target[key]
		const isBlank = (typeof prop !== 'string' || prop.length === 0)
		const error = isBlank ? { string: 'features.EventEdit.features.details.components.DetailsEdit.blank', field: keys[key] } : false
		if (error !== false) {
			newOutput.fields[key].push(error)
			newOutput.summary = [newOutput.summary, error].join(' ')
			newOutput.scope[scope] = originalScopeHasError || true
			newOutput.hasError = true
		}
	}
	return newOutput
	// return mergeApiErrors(target, newOutput, keys, scope)
}

export function mergeApiErrors(target, output, keys, scope) {
	const newOutput = validateOutput(output, keys, scope)

	const errors = target.api_errors
	if (Array.isArray(errors) && errors.length > 0) {

	} else {
		return newOutput
	}
}
