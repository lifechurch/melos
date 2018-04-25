import contentType from './constants'
import { validateSetContentFieldParams, validateRemoveContentParams, validateAddContentParams, validateReorderContentParams } from '../validators/content'
import { toApiFormat } from '../transformers/content'

const ActionCreators = {
	new(params) {
		return {
			type: contentType('new'),
			params
		}
	},

	add(params) {
		try {
			validateAddContentParams(params)
		} catch (err) {
			return {
				type: contentType('addFailure'),
				params: { ...params },
				api_errors: [{ key: err.message }]
			}
		}

		return {
			params: {
				...params,
			},
			api_call: {
				endpoint: 'events',
				method: 'add_content',
				version: '3.2',
				auth: true,
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
				params,
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
				params,
				http_method: 'get',
				types: [ contentType('chapterRequest'), contentType('chapterSuccess'), contentType('chapterFailure') ]
			}
		}
	},

	clearBook(params) {
		return {
			params: {
				...params,
			},
			type: contentType('bookClear')
		}
	},

	clearChapter(params) {
		return {
			params: {
				...params,
			},
			type: contentType('chapterClear')
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
				params,
				http_method: 'get',
				types: [ contentType('versionsRequest'), contentType('versionsSuccess'), contentType('versionsFailure') ]
			}
		}
	},

	setLang(params) {
		return {
			type: contentType('setLang'),
			params
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
				params,
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
		try {
			validateAddContentParams(params)
		} catch (err) {
			return {
				type: contentType('updateFailure'),
				params: { ...params },
				api_errors: [{ key: err.message }]
			}
		}

		return {
			params: {
				...params,
			},
			api_call: {
				endpoint: 'events',
				method: 'update_content',
				version: '3.2',
				auth: true,
				params: toApiFormat(params),
				http_method: 'post',
				types: [ contentType('updateRequest'), contentType('updateSuccess'), contentType('updateFailure') ]
			}
		}
	},

	remove(params) {
		if (typeof params.content_id === 'undefined') {
			return {
				type: contentType('removeRequest'),
				params
			}
		}
		validateRemoveContentParams(params)
		return {
			params: {
				...params,
			},
			api_call: {
				endpoint: 'events',
				method: 'remove_content',
				version: '3.2',
				auth: true,
				params,
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
				auth: true,
				params,
				http_method: 'post',
				types: [ contentType('reorderRequest'), contentType('reorderSuccess'), contentType('reorderFailure') ]
			}
		}
	},

	initUpload(params) {
		return {
			params: {
				...params,
			},
			api_call: {
				endpoint: 'events',
				method: 'image_upload',
				version: '3.2',
				auth: true,
				params,
				http_method: 'get',
				types: [ contentType('initUpload'), contentType('initUploadSuccess'), contentType('initUploadFailure') ]
			}
		}
	},

	initUploadFailure(params) {
		return {
			type: contentType('initUploadFailure'),
			params
		}
	},

	setInsertionPoint(index) {
		return {
			type: contentType('setInsertionPoint'),
			index
		}
	}
}

export default ActionCreators
