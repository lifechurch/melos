const crypto = require('crypto');

export default function mapParamsToState(state, params) {
	const secret = process.env.YIR_SHA1_SECRET_KEY || 'SECRET';
	const algo = 'sha1';
	const hmac = crypto.createHmac(algo, secret);
	hmac.update(params.user_id.toString());

	return Object.assign({}, state, {
		userId: params.user_id,
		userIdHash: hmac.digest('hex'),
		serverLanguageTag: params.languageTag,
		nodeHost: process.env.SECURE_HOSTNAME ? `//${process.env.SECURE_HOSTNAME}` : 'http://localhost:3000'
	})
}