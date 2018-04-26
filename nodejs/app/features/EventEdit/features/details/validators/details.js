import { isBlank } from '../../../../../validators/common'

export function validateEventDetails(event) {
	let { item } = event
	const originalErrors = Object.assign({}, event.errors)

	if (typeof item !== 'object') {
		item = {}
	}

	if (!Array.isArray(item.content)) {
		item.content = []
	}

	const title = 'features.EventEdit.features.details.components.DetailsEdit.eventName'
	const org_name = 'features.EventEdit.features.details.components.DetailsEdit.org'
	const errors = Object.assign({}, originalErrors, isBlank(item, originalErrors, { title, org_name }, 'details'))
	return Object.assign({}, event, { errors })
}

