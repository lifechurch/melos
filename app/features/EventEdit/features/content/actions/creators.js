import contentType from './constants'
import { validateSetContentFieldParams, validateRemoveContentParams, validateAddContentParams, validateReorderContentParams } from '../validators/content'
import { toApiFormat } from '../transformers/content'

const ActionCreators = {
	new (params) {
		return {
			type: contentType('new'),
			params
		}
	},

	add(params) {
		validateAddContentParams(params)
		return {
			params: {
				...params,
			},
			api_call: {
				endpoint: 'events',
				method: 'add_content',
				version: '3.2',
				env: 'staging',
				auth: {
					user: 'ignacio',
					pass: 'password'
				},
				params: toApiFormat(params),
				http_method: 'post',
				types: [ contentType('addRequest'), contentType('addSuccess'), contentType('addFailure') ]
			}
		}
	},

	setField(params) {
		validateSetContentFieldParams(params)
		return {
			type: contentType('setField'),
			...params
		}
	},

	setPlanField(params) {
		return {
			type: contentType('setPlanField'),
			...params
		}
	},

	searchPlans(params) {
		return {
			params: {
				...params,
			},
			api_call: {
				endpoint: 'search',
				method: 'reading_plans',
				version: '3.1',
				env: 'staging',
				params: params,
				http_method: 'get',
				types: [ contentType('searchPlansRequest'), contentType('searchPlansSuccess'), contentType('searchPlansFailure') ]
			}
		}
	},

	selectPlan(params) {
		return {
			type: contentType('selectPlan'),
			...params
		}
	},

	clearPlanSearch() {
		return {
			type: contentType('clearPlanSearch')
		}
	},

	focusPlanSearch(params) {
		return {
			type: contentType('focusPlanSearch'),
			...params
		}
	},

	getChapter(params) {
		return {
			params: {
				...params,
			},
			api_call: {
				endpoint: 'bible',
				method: 'chapter',
				version: '3.1',
				env: 'staging',
				params: params,
				http_method: 'get',
				types: [ contentType('chapterRequest'), contentType('chapterSuccess'), contentType('chapterFailure') ]
			}
		}
	},

    getVersions(params) {
		return {
			params: {
				...params,
			},
			api_call: {
				endpoint: 'bible',
				method: 'versions',
				version: '3.1',
				env: 'staging',
				params: params,
				http_method: 'get',
				types: [ contentType('versionsRequest'), contentType('versionsSuccess'), contentType('versionsFailure') ]
			}
		}
	},

	setVersion(params) {
		// if books already exist pass 'versionSuccess'? (still want to run event.js:versionSuccess)
		return {
			params: {
				...params,
			},
			api_call: {
				endpoint: 'bible',
				method: 'version',
				version: '3.1',
				env: 'staging',
				params: params,
				http_method: 'get',
				types: [ contentType('versionRequest'), contentType('versionSuccess'), contentType('versionFailure') ]
			}
		}
	},

    setReference(params) {
		return {
			type: contentType('setReference'),
			...params
		}
	},

	clearReference(params) {
		return {
			type: contentType('clearReference'),
			...params
		}
	},

	update(params) {
		validateAddContentParams(params)
		return {
			params: {
				...params,
			},
			api_call: {
				endpoint: 'events',
				method: 'update_content',
				version: '3.2',
				env: 'staging',
				auth: {
					user: 'ignacio',
					pass: 'password'
				},
				params: toApiFormat(params),
				http_method: 'post',
				types: [ contentType('updateRequest'), contentType('updateSuccess'), contentType('updateFailure') ]
			}
		}
	},

	remove(params) {
		validateRemoveContentParams(params)
		return {
			params: {
				...params,
			},
			api_call: {
				endpoint: 'events',
				method: 'remove_content',
				version: '3.2',
				env: 'staging',
				auth: {
					user: 'ignacio',
					pass: 'password'
				},
				params: params,
				http_method: 'post',
				types: [ contentType('removeRequest'), contentType('removeSuccess'), contentType('removeFailure') ]
			}
		}
	},

	move(params) {
		return {
			type: contentType('move'),
			...params
		}
	},

	startReorder() {
		return {
			type: contentType('startReorder')
		}
	},

	reorder(params) {
		validateReorderContentParams(params)
		return {
			params: {
				...params,
			},
			api_call: {
				endpoint: 'events',
				method: 'reorder_content',
				version: '3.2',
				env: 'staging',
				auth: {
					user: 'ignacio',
					pass: 'password'
				},
				params: params,
				http_method: 'post',
				types: [ contentType('reorderRequest'), contentType('reorderSuccess'), contentType('reorderFailure') ]
			}
		}
	}
}

export default ActionCreators
