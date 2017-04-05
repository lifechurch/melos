import Immutable from 'immutable'

export default {
	plan(plan, languageTag = 'default') {
		let isValid = false
		let reason

		if (typeof plan !== 'object') {
			reason = `Plan should be an object, not ${typeof plan}`
		} else {
			const _plan = Immutable.fromJS(plan)
			let attr

			if (!_plan.has('id')) {
				attr = 'id'
			} else if (!_plan.has('slug')) {
				attr = 'slug'
			} else if (!(_plan.hasIn(['name', languageTag]) || _plan.hasIn(['name', 'default']))) {
				attr = 'name'
			} else if (!(_plan.hasIn(['about', 'text', languageTag]) || _plan.hasIn(['about', 'text', 'default']))) {
				attr = 'about'
			} else {
				isValid = true
			}

			if (!isValid) {
				reason = `Plan is missing required attribute: ${attr}. Detected attributes: [ ${Object.keys(plan).join(', ')} ]`
			}
		}
		return { isValid, reason }
	}
}
