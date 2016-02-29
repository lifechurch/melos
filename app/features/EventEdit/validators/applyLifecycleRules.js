import defaultState from '../../../defaultState'
import EventStatus from '../eventStatus'

const defaultRules = Object.assign({}, defaultState.event.rules)

export default function(event) {
	let rules = Object.assign({}, defaultRules)
	const { item } = event
	if (typeof item === 'object') {
			console.log("is obj")
			rules = checkStatus(item, rules)
			rules = checkId(item, rules)
			rules = checkVirtualLocations(item, rules)
	}
	console.log(rules)
	return Object.assign({}, event, { rules })
}

function checkStatus(item, rules) {
	const { status } = item

	if (typeof status === 'string') {
		switch(status) {
			case EventStatus('draft'):
				console.log('is draft')
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

				rules.share.canView 						= false
				rules.share.canShare 						= false

				return rules

			case EventStatus('published'):
				console.log('is pub')
				rules.details.canView 					= true
				rules.details.canEdit 					= false

				rules.locations.canView 				= true
				rules.locations.canAddVirtual 	= false
				rules.locations.canAddPhysical 	= false
				rules.locations.canRemove 			= false
				rules.locations.canDelete 			= false
				rules.locations.canEdit 				= false

				rules.content.canView 					= true
				rules.content.canAdd 						= false
				rules.content.canEdit 					= true
				rules.content.canDelete 				= false
				rules.content.canReorder 				= false

				rules.preview.canView						= true
				rules.preview.canPublish				= false

				rules.share.canView 						= true
				rules.share.canShare 						= true
		}
	}
	return rules
}

function checkId(item, rules) {
	const { id } = item
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
	return rules
}

function checkVirtualLocations(item, rules) {
	console.log("cvl")
	const { locations } = item
	if (typeof locations === 'object') {
		console.log('scanning')
		for (let key of Object.keys(locations)) {
			console.log(locations[key])
			const location = locations[key]
			if (location.type === 'virtual') {
				rules.locations.canAddVirtual = false
				break
			}
		}
	}
	return rules
}