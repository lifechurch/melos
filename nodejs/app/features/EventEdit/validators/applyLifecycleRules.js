import defaultState from '../../../defaultState'
import EventStatus from '../eventStatus'

const defaultRules = Object.assign({}, defaultState.event.rules)

export default function (event) {
	const rules = Object.assign({}, defaultRules)
	const { item } = event
	if (typeof item === 'object') {
		checkStatus(event, rules)
		checkId(event, rules)
		checkVirtualLocations(event, rules)
		checkLocationTimes(event, rules)
		checkContent(event, rules)
	}
	return Object.assign({}, event, { rules })
}

function checkStatus(event, rules) {
	const { status } = event.item

	if (typeof status === 'string') {
		switch (status) {
			case EventStatus('draft'):
				rules.details.canView 					= true
				rules.details.canEdit 					= true

				rules.locations.canView 				= true
				rules.locations.canAddVirtual 	= true
				rules.locations.canAddPhysical 	= true
				rules.locations.canRemove 			= true
				rules.locations.canDelete 			= true
				rules.locations.canEdit 				= true

				rules.content.canView 					= true
				rules.content.canAdd 						= true
				rules.content.canEdit 					= true
				rules.content.canDelete 				= true
				rules.content.canReorder 				= true

				rules.preview.canView						= true
				rules.preview.canPublish				= true
				rules.preview.canUnpublish			= false

				rules.share.canView 						= false
				rules.share.canShare 						= false

				break

			case EventStatus('published'):
				rules.details.canView 					= true
				rules.details.canEdit 					= true

				rules.locations.canView 				= true
				rules.locations.canAddVirtual 	= { modal: 'Unpublish' }
				rules.locations.canAddPhysical 	= { modal: 'Unpublish' }
				rules.locations.canRemove 			= { modal: 'Unpublish' }
				rules.locations.canDelete 			= { modal: 'Unpublish' }
				rules.locations.canEdit 				= { modal: 'Unpublish' }

				rules.content.canView 					= true
				rules.content.canAdd 						= true
				rules.content.canEdit 					= true
				rules.content.canDelete 				= true
				rules.content.canReorder 				= true

				rules.preview.canView						= true
				rules.preview.canPublish				= false
				rules.preview.canUnpublish			= true

				rules.share.canView 						= true
				rules.share.canShare 						= true

				break

			case EventStatus('live'):
				rules.details.canView 					= true
				rules.details.canEdit 					= false

				rules.locations.canView 				= true
				rules.locations.canAddVirtual 	= false
				rules.locations.canAddPhysical 	= false
				rules.locations.canRemove 			= false
				rules.locations.canDelete 			= false
				rules.locations.canEdit 				= false

				rules.content.canView 					= true
				rules.content.canAdd 						= true
				rules.content.canEdit 					= true
				rules.content.canDelete 				= { modal: 'LiveWarning' }
				rules.content.canReorder 				= true

				rules.preview.canView						= true
				rules.preview.canPublish				= false
				rules.preview.canUnpublish			= false

				rules.share.canView 						= true
				rules.share.canShare 						= true

				break
		}
	}
}

function checkId(event, rules) {
	const { id } = event.item
	if (typeof id !== 'number' || id <= 0) {
		rules.locations.canView 				= false
		rules.locations.canAddVirtual 	= false
		rules.locations.canAddPhysical 	= false
		rules.locations.canRemove 			= false
		rules.locations.canDelete 			= false
		rules.locations.canEdit 				= false

		rules.content.canView 					= false
		rules.content.canAdd 						= false
		rules.content.canEdit 					= false
		rules.content.canDelete 				= false
		rules.content.canReorder 				= false

		rules.preview.canView						= false

		rules.share.canView							= false
	}
}

function checkVirtualLocations(event, rules) {
	const { locations } = event.item
	if (typeof locations === 'object') {
		for (const key of Object.keys(locations)) {
			const location = locations[key]
			if (location.type === 'virtual' && (location.isSelected === true || typeof location.isSelected === 'undefined')) {
				rules.locations.canAddVirtual = false
				break
			}
		}
	}
}

function checkLocationTimes(event, rules) {
	const { locations } = event.item
	if (typeof locations === 'object') {
		for (const key of Object.keys(locations)) {
			const location = locations[key]
			if (location.isSelected === true && (!Array.isArray(location.times) || location.times.length === 0)) {
				rules.preview.canPublish = false
				event.publishMessage = 'features.EventEdit.errors.locationMustHaveTime'
				break
			}
		}

		if (rules.preview.canPublish) {
			event.publishMessage = null
		}
	} else {
		rules.preview.canPublish = false
		event.publishMessage = 'features.EventEdit.errors.locationRequired'
	}
}

function checkContent(event, rules) {
	const { content } = event.item
	if (!Array.isArray(content) || content.length === 0) {
		rules.preview.canPublish = false
		event.publishMessage = 'features.EventEdit.errors.contentRequired'
	} else if (rules.preview.canPublish) {
		event.publishMessage = null
	}

	for (const c of content) {
		if (typeof c.content_id === 'undefined') {
			rules.content.canReorder = false
		}
	}
}
