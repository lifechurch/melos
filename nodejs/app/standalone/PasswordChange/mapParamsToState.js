export default function mapParamsToState(state, params) {
	return Object.assign({}, state, {
		Password: {
			...state.Password,
			apiToken: params.token,
			strings: params.strings
		}
	})
}