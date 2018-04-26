export default {
	auth: {
		token: null,
		isLoggedIn: false,
		isWorking: false,
		userData: {
			first_name: null,
			last_name: null,
			email: null,
			language_tag: null,
			timezone: null
		},
		user: null,
		password: null,
		errors: {
			api: null,
			fields: {
				user: null,
				password: null
			}
		}
	},
	content: {},
	event: {
		errors: {
			summary: '',
			fields: []
		},
		publishMessage: null,
		isFetching: false,
		isSaving: false,
		isDirty: false,
		item: {
			org_name: null,
			status: 'draft',
			updated_dt: null,
			description: null,
			title: null,
			image_id: null,
			images: null,
			locations: {},
			content: [],
			created_dt: null,
			id: null,
			owner_id: null
		},
		rules: {
			details: {
				canView: true,
				canEdit: true
			},
			locations: {
				canView: false,
				canAddPhysical: false,
				canAddVirtual: false,
				canRemove: false,
				canDelete: false,
				canEdit: false
			},
			content: {
				canView: false,
				canAdd: false,
				canEdit: false,
				canDelete: false,
				canReorder: false
			},
			preview: {
				canView: false,
				canPublish: false,
				canUnpublish: false
			},
			share: {
				canView: false,
				canShare: false
			}
		}
	},
	loc: {},
	locations: {
		hasError: false,
		errors: [],
		isFetching: false,
		items: []
	},
	references: {
		order: {

		},
		langs: {

		},
		versions: {

		},
		books: {

		}
	},
	plans: {
		query: '',
		language_tag: 'en',
		items: [],
		focus_id: 0,
		isFetching: false,
	},
	plansDiscovery: {
		hasError: false,
		errors: [],
		isFetching: false,
		items: [],
		collection: {
			items: []
		},
		configuration: {
			images: {}
		}
	},
	eventFeeds: {

		/* API: events/search */
		discover: {
			hasError: false,
			errors: [],
			isFetching: false,
			items: []
		},

		/* API: events/saved_items */
		saved: {
			hasError: false,
			errors: [],
			isFetching: false,
			items: []
		},

		/* API: events/items */
		mine: {
			hasError: false,
			errors: [],
			isFetching: false,
			items: [],
			page: 1,
			next_page: null
		}
	}
}
