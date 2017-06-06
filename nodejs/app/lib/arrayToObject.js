export default function arrayToObject(a, keyProperty) {
	if (!Array.isArray(a)) {
		if (['null', 'undefined'].indexOf(typeof a) === -1) {
			return {}
		} else {
			throw new Error('Passed a non-array to `arrayToObject`.')
		}
	}

	if (typeof keyProperty !== 'string') {
		throw new Error('`arrayToObject` expects `keyProperty` to be a string.')
	}

	return a.reduce((prev, curr, idx) => {
		const key = curr[keyProperty]

		if (typeof curr !== 'object') {
			throw new Error('`arrayToObject` only supports arrays of objects.')
		}

		if (['number', 'string'].indexOf(typeof key) === -1) {
			throw new Error('`arrayToObject` expects value of a[keyProperty] to be a number or string.')
		}

		return Object.assign(prev, { [key]: curr })

	}, {})
}