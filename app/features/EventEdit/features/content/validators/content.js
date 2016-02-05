export function validateSetContentFieldParams(params) {
	const { index, field, value } = params

	if (typeof index !== 'number') {
		throw new Error('Invalid Content Index')
	}

	if (typeof field !== 'string') {
		throw new Error('Content Field Name must be string')
	}

	if (typeof value !== 'string' && typeof value !== 'number') {
		throw new Error('Content Field Value must be string or number')
	}
}

export function validateRemoveContentParams(params) {
	const { index, id, content_id } = params

	if (typeof index !== 'number') {
		throw new Error('Remove: Invalid Content Index')
	}

	if (typeof content_id !== 'number') {
		throw new Error('Remove: Invalid Content ID')
	}

	if (typeof id !== 'number') {
		throw new Error('Remove: Invalid Event ID')
	}
}

export function validateReorderContentParams(params) {
	const { event_id, ids } = params

	if (typeof event_id !== 'number') {
		throw new Error('Reorder: Invalid Event ID')
	}

	if (!Array.isArray(ids) || ids.length === 0) {
		throw new Error('Reorder: Invalid Content IDs')
	}
}


export function validateAddContentParams(params) {
	const { index, type, sort, id, data } = params

	if (typeof index !== 'number') {
		throw new Error('Invalid Content Index')
	}

	if (['text', 'announcement', 'reference', 'plan', 'url', 'image'].indexOf(type) === -1) {
		throw new Error('Invalid content type: ' + type)
	}

	if (typeof sort !== 'number') {
		throw new Error('Invalid sort value: ' + sort)
	}

	if (typeof id !== 'number') {
		throw new Error('Invalid Event ID: ' + id)
	}

	if (typeof data !== 'object') {
		throw new Error('Invalid Content data: ' + data)
	}

	switch(type) {
		case 'text':
			validateTextType(data)
			break

		case 'announcement':
			validateAnnouncementType(data)
			break

		case 'reference':
			validateReferenceType(data)
			break

		case 'plan':
			validatePlanType(data)
			break

		case 'url':
			validateUrlType(data)
			break

		case 'image':
			validateImageType(data)
			break
	}
}

function validateTextType(params) {
	const { body } = params

	if (typeof body !== 'string') {
		throw new Error('Content Type Text requires `body` to be a string')
	}
}

function validateAnnouncementType(params) {
	const { title, body } = params

	if (typeof title !== 'string') {
		throw new Error('Content Type Announcement requires `title` to be a string')
	}

	if (typeof body !== 'string') {
		throw new Error('Content Type Announcement requires `body` to be a string')
	}
}

function validateReferenceType(params) {
	const { usfm, version_id } = params

	if (!Array.isArray(usfm) || usfm.length === 0) {
		throw new Error('Content type Reference requires `usfm` to be array')
	}

	if (typeof version_id !== 'number') {
		throw new Error('Content type Reference requires `version_id` to be an integer')
	}
}

function validatePlanType(params) {
	const { id, language_tag } = params

	if (typeof id !== 'number') {
		throw new Error('Content Type Plan requires `id` to be an integer')
	}

	if (typeof language_tag !== 'string') {
		throw new Error('Content Type Plan requires `language_tag` to be a string')
	}
}

function validateUrlType(params) {
	const { url, title, body } = params

	if (typeof title !== 'string') {
		throw new Error('Content Type URL requires `title` to be a string')
	}

	if (typeof body !== 'string') {
		throw new Error('Content Type URL requires `body` to be a string')
	}

	if (typeof url !== 'string') {
		throw new Error('Content Type URL requires `url` to be a string')
	}
}

function validateImageType(params) {
	const { image_id, body } = params

	if (typeof body !== 'string') {
		throw new Error('Content Type Image requires `body` to be a string')
	}

	if (typeof image_id !== 'string') {
		throw new Error('Content Type Image requires `image_id` to be a string')
	}
}
