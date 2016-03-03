import { isBlank } from '../../../../../validators/common'

export function validateEventDetails(event) {
	let { item, originalErrors } = event

	if (typeof item !== 'object') {
		item = {}
	}

	if (!Array.isArray(item.content)) {
		item.content = []
	}

	const errors = Object.assign({}, originalErrors, isBlank(item, originalErrors, {'title': 'Event Name', 'org_name': 'Church Name or Organization'}, 'details'))
	return Object.assign({}, event, { errors })
}

