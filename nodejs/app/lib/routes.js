import { localizedLink } from './routeUtils'

export const queryifyParamsObj = (params) => {
	// convert query: { redirect: true } to route?redirect=true
	return Object.keys(params).reduce((acc, key) => {
		const val = params[key]
		return val
			? `${acc}${key}=${val}&`
			: ''
	}, '').replace(/&\s*$/, '') // strip trailing &
}

class Route {
	constructor({ path, query, serverLanguageTag }) {
		this.route = localizedLink(path, serverLanguageTag)
		this.query = query
	}

	queryify() {
		if (this.query && typeof this.query === 'object') {
			// convert query: { redirect: true } to route?redirect=true
			const queryParams = queryifyParamsObj(this.query)
			return `${this.route}?${queryParams}`
		}
		return this.route
	}

	get() {
		const route = this.query
			? this.queryify()
			: this.route

		return route
	}
}

/**
 * query is an object containing key value pairs that are converted to the
 * correct format for the url
 */
const Routes = {
	// signup/signin -------------------------------------------------------------
	signIn: ({ query = null, serverLanguageTag = null }) => {
		const route = new Route({
			path: '/sign-in',
			query,
			serverLanguageTag,
		})

		return route.get()
	},
	signUp: ({ query = null, serverLanguageTag = null }) => {
		const route = new Route({
			path: '/sign-up',
			query,
			serverLanguageTag,
		})

		return route.get()
	},
	// users ---------------------------------------------------------------------
	user: ({ username, query = null, serverLanguageTag = null }) => {
		const route = new Route({
			path: `/users/${username}`,
			query,
			serverLanguageTag,
		})

		return route.get()
	},
	// subscriptions -------------------------------------------------------------
	subscriptions: ({ username, query = null, serverLanguageTag = null }) => {

		const route = new Route({
			path: `/users/${username}/reading-plans`,
			query,
			serverLanguageTag,
		})

		return route.get()
	},
	subscriptionsSaved: ({ username, query = null, serverLanguageTag = null }) => {

		const route = new Route({
			path: `/users/${username}/saved-reading-plans`,
			query,
			serverLanguageTag,
		})

		return route.get()
	},
	subscriptionsCompleted: ({ username, query = null, serverLanguageTag = null }) => {

		const route = new Route({
			path: `/users/${username}/completed-reading-plans`,
			query,
			serverLanguageTag,
		})

		return route.get()
	},
	subscription: ({ username, plan_id, slug, subscription_id, query = null, serverLanguageTag = null }) => {

		const route = new Route({
			path: `/users/${username}/reading-plans/${plan_id}${slug ? `-${slug}` : ''}/subscription/${subscription_id}`,
			query,
			serverLanguageTag,
		})

		return route.get()
	},
	subscriptionSettings: ({ username, plan_id, slug, subscription_id, query = null, serverLanguageTag = null }) => {

		const route = new Route({
			path: `/users/${username}/reading-plans/${plan_id}${slug ? `-${slug}` : ''}/subscription/${subscription_id}/edit`,
			query,
			serverLanguageTag,
		})

		return route.get()
	},
	subscriptionDay: ({ username, plan_id, slug, day, subscription_id, query = null, serverLanguageTag = null }) => {

		const route = new Route({
			path: `/users/${username}/reading-plans/${plan_id}${slug ? `-${slug}` : ''}/subscription/${subscription_id}/day/${day}`,
			query,
			serverLanguageTag,
		})

		return route.get()
	},
	subscriptionContent: ({ username, plan_id, slug, day, content, subscription_id, query = null, serverLanguageTag = null }) => {

		const route = new Route({
			path: `/users/${username}/reading-plans/${plan_id}${slug ? `-${slug}` : ''}/subscription/${subscription_id}/day/${day}/segment/${content}`,
			query,
			serverLanguageTag,
		})

		return route.get()
	},
	subscriptionDayComplete: ({ username, plan_id, slug, day, subscription_id, query = null, serverLanguageTag = null }) => {

		const route = new Route({
			path: `/users/${username}/reading-plans/${plan_id}${slug ? `-${slug}` : ''}/subscription/${subscription_id}/day/${day}/completed`,
			query,
			serverLanguageTag,
		})

		return route.get()
	},
	sharedDayComplete: ({ plan_id, slug, day, subscription_id, query = null, serverLanguageTag = null }) => {

		const route = new Route({
			path: `reading-plans/${plan_id}${slug ? `-${slug}` : ''}/subscription/${subscription_id}/day/${day}/completed`,
			query,
			serverLanguageTag,
		})

		return route.get()
	},
	subscriptionComplete: ({ username, plan_id, slug, query = null, serverLanguageTag = null }) => {

		const route = new Route({
			path: `/users/${username}/reading-plans/${plan_id}${slug ? `-${slug}` : ''}/completed`,
			query,
			serverLanguageTag,
		})

		return route.get()
	},

	// plans ---------------------------------------------------------------------
	plans: ({ query = null, serverLanguageTag = null }) => {

		const route = new Route({
			path: '/reading-plans',
			query,
			serverLanguageTag,
		})

		return route.get()
	},
	plan: ({ plan_id, slug, query = null, serverLanguageTag = null }) => {

		const route = new Route({
			path: `/reading-plans/${plan_id}${slug ? `-${slug}` : ''}`,
			query,
			serverLanguageTag,
		})

		return route.get()
	},

	// together ------------------------------------------------------------------
	togetherCreate: ({ username, plan_id, slug, query = null, serverLanguageTag = null }) => {

		const route = new Route({
			path: `/users/${username}/reading-plans/${plan_id}${slug ? `-${slug}` : ''}/together/create`,
			query,
			serverLanguageTag,
		})

		return route.get()
	},
	togetherInvite: ({ username, plan_id, slug, together_id, query = null, serverLanguageTag = null }) => {

		const route = new Route({
			path: `/users/${username}/reading-plans/${plan_id}${slug ? `-${slug}` : ''}/together/${together_id}/invite`,
			query,
			serverLanguageTag,
		})

		return route.get()
	},
	togetherInvitation: ({ plan_id, slug, together_id, query = null, serverLanguageTag = null }) => {

		const route = new Route({
			path: `/reading-plans/${plan_id}${slug ? `-${slug}` : ''}/together/${together_id}/invitation`,
			query,
			serverLanguageTag,
		})

		return route.get()
	},
	togetherParticipants: ({ plan_id, slug, together_id, query = null, serverLanguageTag = null }) => {

		const route = new Route({
			path: `/reading-plans/${plan_id}${slug ? `-${slug}` : ''}/together/${together_id}/participants`,
			query,
			serverLanguageTag,
		})

		return route.get()
	},
	// bible ---------------------------------------------------------------------
	version: ({ version_id, query = null, serverLanguageTag = null }) => {
		const route = new Route({
			path: `/bible/${version_id}`,
			query,
			serverLanguageTag,
		})

		return route.get()
	},
	reference: ({ version_id, usfm, version_abbr = null, query = null, serverLanguageTag = null }) => {
		const route = new Route({
			path: `/bible/${version_id}/${usfm}${version_abbr ? `.${version_abbr}` : ''}`,
			query,
			serverLanguageTag,
		})

		return route.get()
	},
	// verse of the day ----------------------------------------------------------
	votd: ({ query = null, serverLanguageTag = null }) => {
		const route = new Route({
			path: '/verse-of-the-day',
			query,
			serverLanguageTag,
		})

		return route.get()
	},
	// notifications -------------------------------------------------------------
	notifications: ({ query = null, serverLanguageTag = null }) => {
		const route = new Route({
			path: '/notifications',
			query,
			serverLanguageTag,
		})

		return route.get()
	},
	notificationsEdit: ({ query = null, serverLanguageTag = null }) => {
		const route = new Route({
			path: '/notifications/edit',
			query,
			serverLanguageTag,
		})

		return route.get()
	}
}
export default Routes
