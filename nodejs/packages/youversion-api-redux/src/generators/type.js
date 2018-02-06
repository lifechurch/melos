export default function typeGenerator({ endpoint }) {
	return {
		[`${endpoint}TypeName`]: function typeName(method, action) {
			return `${endpoint}__${method}__${action}`.toUpperCase()
		},

		[`${endpoint}TypeLookup`]: function typeLookup(typeName) {
			const [ actionEndpoint, method, action ] = typeName.toLowerCase().split('__')
			return {
				endpoint: actionEndpoint,
				method,
				action
			}
		}
	}
}
