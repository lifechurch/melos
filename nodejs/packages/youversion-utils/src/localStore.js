import cookie from 'react-cookie'
import Immutable from 'immutable'

function getKeysAndValue(key) {
	if (typeof key === 'undefined') {
		throw new Error('LocalStore: Invalid key \'undefined\' for setIn/getIn.')
	}

	const keys = key.split('.')
	const storageKey = keys.splice(0, 1)

	if (keys.length < 1) {
		throw new Error(`LocalStore: Invalid key for setIn/getIn: ${key}. Must contain at least two keys delimited by a period.`)
	}

	let storageObject = cookie.load(storageKey)

	keys.push('_val')

	if (typeof storageObject === 'undefined') {
		storageObject = {}
	} else if (typeof storageObject !== 'object' || Array.isArray(storageObject)) {
		throw new Error(`LocalStore: An non-object value already exists with the key ${storageKey}`)
	}

	return {
		keys,
		storageKey,
		storageObject
	}
}


function getMergedOptions(opts) {
	const defaultOpts = {
		path: '/',
		maxAge: 60 * 60 * 24 * 365 * 2
	}
	return Immutable.fromJS(defaultOpts).mergeDeep(opts).toJS()
}

export default {
	set(key, value, opt = {}) {
		cookie.save(key, value, getMergedOptions(opt))
	},

	setIn(key, value, opt = {}) {
		const { keys, storageKey, storageObject } = getKeysAndValue(key)
		cookie.save(storageKey, Immutable.fromJS(storageObject).setIn(keys, value).toJS(), getMergedOptions(opt))
	},

	get(key) {
		const value = cookie.load(key)
		return value === '' ? null : value
	},

	getIn(key) {
		const { keys, storageObject } = getKeysAndValue(key)
		return Immutable.fromJS(storageObject).getIn(keys)
	},

	delete(key, opt = {}) {
		cookie.remove(key, getMergedOptions(opt))
	},

	deleteIn(key, opt = {}) {
		const { keys, storageKey, storageObject } = getKeysAndValue(key)
		cookie.save(storageKey, Immutable.fromJS(storageObject).deleteIn(keys).toJS(), getMergedOptions(opt))
	}
}
