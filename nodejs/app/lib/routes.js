class Route {
	constructor({ path, query }) {
		this.route = path
		this.query = query
	}

	queryify() {
		if (this.query && typeof this.query === 'object') {
			// convert query: { redirect: true } to route?redirect=true
			const queryParams = Object.keys(this.query).reduce((acc, key) => {
				const val = this.query[key]
				return `${acc}${key}=${val}&`
			}, '')
			return `${this.route}?${queryParams}`
		}
		return this.route
	}

	get() {
		const route = this.query ?
									this.queryify() :
									this.route
		if (!route ||
				route.includes('null') ||
				route.includes('undefined')
			) {
			return null
		}

		return route
	}
}

/**
 * query is an object containing key value pairs that are converted to the
 * correct format for the url
 */
const Routes = {
	// signup/signin -------------------------------------------------------------
	signIn: ({ query = null }) => {
		const route = new Route({
			path: '/sign-in',
			query,
		})

		return route.get()
	},
	signUp: ({ query = null }) => {
		const route = new Route({
			path: '/sign-up',
			query,
		})

		return route.get()
	},
	// subscriptions -------------------------------------------------------------
	subscriptions: ({ username, query = null }) => {

		const route = new Route({
			path: `/users/${username}/reading-plans`,
			query,
		})

		return route.get()
	},
	subscriptionsSaved: ({ username, query = null }) => {

		const route = new Route({
			path: `/users/${username}/saved-reading-plans`,
			query,
		})

		return route.get()
	},
	subscriptionsCompleted: ({ username, query = null }) => {

		const route = new Route({
			path: `/users/${username}/completed-reading-plans`,
			query,
		})

		return route.get()
	},
	subscription: ({ username, plan_id, slug, subscription_id, query = null }) => {

		const route = new Route({
			path: `/users/${username}/reading-plans/${plan_id}-${slug}/subscription/${subscription_id}`,
			query,
		})

		return route.get()
	},
	subscriptionDay: ({ username, plan_id, slug, day, subscription_id, query = null }) => {

		const route = new Route({
			path: `/users/${username}/reading-plans/${plan_id}-${slug}/subscription/${subscription_id}/day/${day}`,
			query,
		})

		return route.get()
	},
	subscriptionContent: ({ username, plan_id, slug, day, content, subscription_id, query = null }) => {

		const route = new Route({
			path: `/users/${username}/reading-plans/${plan_id}-${slug}/subscription/${subscription_id}/day/${day}/segment/${content}`,
			query,
		})

		return route.get()
	},
	subscriptionDayComplete: ({ username, plan_id, slug, day, subscription_id, query = null }) => {

		const route = new Route({
			path: `/users/${username}/reading-plans/${plan_id}-${slug}/subscription/${subscription_id}/day/${day}/completed`,
			query,
		})

		return route.get()
	},
	sharedDayComplete: ({ plan_id, slug, day, subscription_id, query = null }) => {

		const route = new Route({
			path: `reading-plans/${plan_id}-${slug}/subscription/${subscription_id}/day/${day}/completed`,
			query,
		})

		return route.get()
	},

	// plans ---------------------------------------------------------------------
	plans: ({ query = null }) => {

		const route = new Route({
			path: '/reading-plans',
			query,
		})

		return route.get()
	},
	plan: ({ plan_id, slug, query = null }) => {

		const route = new Route({
			path: `/reading-plans/${plan_id}-${slug}`,
			query,
		})

		return route.get()
	},

	// together ------------------------------------------------------------------
	togetherCreate: ({ username, plan_id, slug, query = null }) => {

		const route = new Route({
			path: `/users/${username}/reading-plans/${plan_id}-${slug}/together/create`,
			query,
		})

		return route.get()
	},
	togetherInvite: ({ username, plan_id, slug, together_id, query = null }) => {

		const route = new Route({
			path: `/users/${username}/reading-plans/${plan_id}-${slug}/together/${together_id}/invite`,
			query,
		})

		return route.get()
	},
	togetherParticipants: ({ username, plan_id, slug, together_id, query = null }) => {

		const route = new Route({
			path: `/users/${username}/reading-plans/${plan_id}-${slug}/together/${together_id}/participants`,
			query,
		})

		return route.get()
	},
}
export default Routes
