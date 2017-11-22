export default function mapParamsToState(state, params) {
  return Object.assign({}, state, {
    userId: params.user_id,
    serverLanguageTag: params.languageTag
  })
}
