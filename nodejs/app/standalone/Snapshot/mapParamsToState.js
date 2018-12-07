export default function mapParamsToState(state, params) {
	return Object.assign({}, state, {
		userId: params.user_id,
		userIdHash: params.user_id_hash,
		serverLanguageTag: params.languageTag,
		viewingMine: params.viewing_mine,
		year: params.year,
		imageLocale: params.imageLocale,
		nodeHost: process.env.SECURE_HOSTNAME ? `//${process.env.SECURE_HOSTNAME}` : 'http://localhost:3000'
	})
}
