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
	event: {
		errors: {
			summary: '',
			fields: []
		},
		isFetching: false,
		isSaving: false,
		isDirty: false,
		item: {
			org_name: null,
			status: "draft",
			updated_dt: null,
			description: null,
			title: null,
			image: [],
			locations: {},
			content: [],
			created_dt: null,
			id: null,
			owner_id: null
		}
	},
	loc: {},
	locations: {
		hasError: false,
		errors: [],
		isFetching: false,
		items: []
	},
	plans: {
		query: '',
		language_tag: 'en',
		items: [],
        focus_id: 0,
		isFetching: false
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
			items: []
		}
	}
}
