export default function mapParamsToState(state, params) {
	return Object.assign({}, state, {
		serverLanguageTag: params.languageTag,
		altVersions: params.altVersions
	})
}