import { isBlank, mergeApiErrors } from '../../../../../validators/common'
 
export function validateEventDetails(event) {
	let { item, originalErrors } = event
	if (typeof item !== 'object') {
		item = {}
	}

	if (!Array.isArray(item.content)) {
		item.content = []
	}

	const errors = Object.assign({}, originalErrors, isBlank(item, originalErrors, ['title', 'org_name', 'description'], 'details'))
	return Object.assign({}, event, { errors })
}

