export default function mapParamsToState(state, params) {
  return Object.assign({}, state, {
    userId: params.user_id,
    serverLanguageTag: params.languageTag,
    nodeHost: process.env.SECURE_HOSTNAME || 'http://localhost:3000'
  })
}