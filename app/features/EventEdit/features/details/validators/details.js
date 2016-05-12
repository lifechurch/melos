import { isBlank } from '../../../../../validators/common'

export function validateEventDetails(event) {
	let { item } = event
	let originalErrors = Object.assign({}, event.errors)

	if (typeof item !== 'object') {
		item = {}
	}

	if (!Array.isArray(item.content)) {
		item.content = []
	}

	const title = intl.formatMessage({id:"features.EventEdit.features.details.components.DetailsEdit.eventName"})
	const org_name = intl.formatMessage({id:"features.EventEdit.features.details.components.DetailsEdit.org"})
	const errors = Object.assign({}, originalErrors, isBlank(item, originalErrors, {'title': title , 'org_name': org_name }, 'details'))
	return Object.assign({}, event, { errors })
}

