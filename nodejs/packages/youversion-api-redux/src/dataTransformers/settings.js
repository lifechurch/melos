import Immutable from 'immutable'

const settingsTransformer = (data, prevData, action) => {
	if (data) {
		const { request: { pathvars: { id, kind } } } = action
		if (kind) {
			return Immutable
				.fromJS(prevData)
				.mergeDeepIn([`${id}`, `${kind}`], data.setting)
				.toJS()
		} else if (data.data) {
			const settings = {}
			data.data.forEach((setting) => {
				settings[setting.kind] = setting.setting
			})
			return Immutable
				.fromJS(prevData)
				.mergeDeepIn([`${id}`], settings)
				.toJS()
		}
	}
	return prevData || {}
}

export default settingsTransformer
