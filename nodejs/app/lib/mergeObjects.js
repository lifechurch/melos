export default function mergeObjects(o1, o2) {
	return mergeOne(o2, mergeOne(o1, {}))
}

function mergeOne(o1, o) {
	for (const key in o1) {
		if (typeof o[key] !== 'undefined') {
			o[key] = Object.assign({}, o[key], o1[key])
		} else {
			o[key] = o1[key]
		}
	}
	return o
}