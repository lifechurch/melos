export default function queryifyParamsObj(params = {}) {
	// convert query: { redirect: true } to route?redirect=true
	return Object.keys(params).reduce((acc, key) => {
		const val = params[key]
		return val
			? `${acc}${key}=${val}&`
			: ''
	}, '').replace(/&\s*$/, '') // strip trailing &
}
