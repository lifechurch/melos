
# So, you want to make some YouVersion API calls?

You've come to the right place 😎.

This library uses [redux](http://redux.js.org/) to dispatch actions and manage application state and [reselect](https://github.com/reactjs/reselect) to grab specific pieces of that state for use in bible.com views.

There are 3 main pieces that work together to manage our application state, hence the 3 main pieces that make up this redux library:

1. Actions: Request a change to the app state
2. Reducers: Listen for a state change action
3. Selectors: Access the current app state

> Note:
>
> Redux actions for making YouVersion API calls are (obviously) directly related to the YouVersion API, whose docs are found [here](https://docs.thewardro.be/api/docs/3.1/sections.html)

## Install

`export NPM_TOKEN=YOUR_NPM_TOKEN_FOR_YOUVERSION`

`npm install @youversion/api-redux`


## Usage

First, let's just look at a quick example, and then go in depth at what it takes to make and build api calls.

In the Plan Info view, we need to make the [Reading Plan View](https://docs.thewardro.be/api/docs/3.1/sections/reading-plans/view.html) call to give us reading plan information such as the plan title and image.

A barebones `PlanInfo.js` component that just grabs the data it needs would look like this:

> Note:
>
> all examples in this doc will be dispatching api call actions from within the component being rendered, but make sure to check out the Server Rendering section

``` javascript
// PlanInfo.js
import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
// actions
import plansAction from '@youversion/api-redux/lib/endpoints/readingPlans/action'
// selectors
import { getPlansModel } from '@youversion/api-redux/lib/models/readingPlans'


class PlanInfo extends Component {
	componentDidMount() {
		const { plan_id, plan, dispatch } = this.props
		// when the component gets rendered lets check if the plan hasn't been fetched already and fetch it if we need to
		if (!plan) {
			// dispatch is injected into props with the react-redux connect()
			dispatch(plansAction({
				method: 'view',
				params: {
					id: plan_id,
				},
			}))
		}
	}

	render() {
		const { plan, serverLanguageTag } = this.props

		const planName = plan
			&& plan.name
			? (plan.name[serverLanguageTag] || plan.name.default)
			: null
		return (
			<h1>{ planName }</h1>
		)
	}
}

function mapStateToProps(state, props) {
	const { plan_id } = props
	return {
		// the plansModel is selecting
		// state.api.readingPlans.view[plan_id].response
		// from state
		plan: getPlansModel(state)
			&& getPlansModel(state).byId
			&& plan_id && getPlansModel(state).byId
			&& getPlansModel(state).byId[plan_id]
	}
}

PlanInfo.propTypes = {
	plan: PropTypes.object,
	serverLanguageTag: PropTypes.string,
	dispatch: PropTypes.func.isRequired,
}

PlanInfo.defaultProps = {
	plan: null,
	serverLanguageTag: 'en',
}

export default connect(mapStateToProps, null)(PlanInfo)


```

So what's happening here? There are a few key things to point out:

1. When the component mounts, we are dispatching an **action** to fetch a Reading Plan View resource with the plan_id that is passed into the component
2. When that action succeeds, a function called a **reducer** updates the application state with the response from the API call
3. We are using the `getPlansModel` **selector** to select the reading plan data that was updated by the reducer



## Building and Making API Calls

There are 5 steps to building an endpoint:

1. Create the endpoint's actions
2. Create the endpoint's reducers
3. Create a selector to access the state data supplied by the reducer
4. Add the new endpoint's reducer to the standalone feature's reducer to ensure the state of the app will accept state from the new reducer
5. Add the new endpoint into the whitelist of endpoints in `/middleware/youversionapi.js` to ensure the middleware accepts calls to the new endpoint

Let's expand upon the previous Reading Plan View call and dig in.

#### Actions: Request a change to the app state

The [redux](http://redux.js.org/) documentation describes actions as such:

> Actions are payloads of information that send data from your application to your store. They are the only source of information for the store.

In our case, the action that we are dispatching is an object returned by a call to the plansAction function with the following parameters:

``` javascript
dispatch(plansAction({
	method: 'view',
	params: {
		id: plan_id,
	},
}))
```

The actual generated payload being dispatched is a simple javascript object which in this case, looks (mostly) like this:

``` javascript
{
	params: {
		id: plan_id,
	},
	extras: {},
	api_call: {
		endpoint: 'reading-plans',
		method: 'view',
		version: '3.1',
		http_method: 'get',
		type: 'READING-PLANS__VIEW__REQUEST',
	}
}
```

This object contains an `api_call` key which is passed on to our YouVersion API middleware which takes the params and builds out and executes the API call on the server.

However, all we need to know to be able to use these API call actions is what endpoint we want to hit along with the endpoint method (think collection or resource in RESTful APIs), and what params need to be sent for the request to succeed. The endpoint specifics are found in the API [docs](https://docs.thewardro.be/api/docs/3.1/sections.html).

As seen in the usage example, the `plansAction` function is imported from `/endpoints/readingPlans/action`, so we need to make sure the `action.js` file contains the following code:

``` javascript
// /src/endpoints/readingPlans/action.js
import actionGenerator from '../../generators/action'

const readingPlans = actionGenerator({
	endpoint: 'reading-plans'
})

export default readingPlans
```

This is all there is to creating a set of actions for an endpoint!

Our endpoints are generated with what we call an `actionGenerator` with a few params describing the API endpoint.
Note that we are hitting the `reading-plans` endpoint along with whatever `method` we pass into the function. In our example, we are passing `{ method: 'view', params: { id: plan_id } }` which is used by the middleware to build out the url we want to hit, `reading-plans.youversionapi.com/3.1/view.json` with the `plan_id` that is passed into the component from its renderer (parent view).

We will call this function for every method we want to hit on the reading plans endpoint. To instead view stats for a specific reading plan, we would make a `stats` call, passing `{ method: 'stats', params: { id: plan_id } }`.

So putting it all together, when the `PlanInfo` component mounts to the DOM, we fire off an action that requests reading plan data for the plan_id passed into the component. Now we need to listen for each action type for the `READING-PLANS__VIEW` actions and do the correct thing based on the type.

#### Reducers: Listen for state change actions

Reducers subscribe to any specified action and respond accordingly. This is how we populate the app state with the response from API call actions.

The redux documentation says the following about reducers:

> Actions describe the fact that something happened, but don't specify how the application's state changes in response. This is the job of reducers.

Just as we have a function to generate actions based on the endpoint and method of an API call, we also have a function that generates the reducer to listen to the appropriate actions for an API call.

We create our reducers for the reading plans endpoint like so:

``` javascript
// /src/endpoints/readingPlans/reducer.js
import reducerGenerator from '../../generators/reducer'

const readingPlansReducer = reducerGenerator('reading-plans')

export default readingPlansReducer

```

Piece of 🍰

In most cases, the reducer (and action) code is almost identical between each endpoint and method, which is why we have created generator functions to build out the actions and reducers for each endpoint and method.

The actual generated output for the `reducerGenerator` looks something like this:

``` javascript
import Immutable from 'immutable'

export default function reducer(state = {}, action) {
	switch (action.type) {
		const { params, response } = action

		case 'READING-PLANS__VIEW__REQUEST':
			return Immutable
				.fromJS(state)
				.setIn(['view', ${params.id}, 'loading'], true)
				.toJS()

		case 'READING-PLANS__VIEW__FAILURE':
			return Immutable
				.fromJS(state)
				.setIn(['view', ${params.id}], {
					errors: response.errors,
					loading: false
				})
				.toJS()

		case 'READING-PLANS__VIEW__SUCCESS':
			return Immutable
				.fromJS(state)
				.setIn(['view', ${params.id}], {
					response,
					loading: false
				})
				.toJS()
		default:
			return state
	}
}

```

It may look confusing at first, but a reducer is just a pure function that takes an input, and calculates a new output.

You'll notice there are 3 different action types for every `READING-PLANS` action: `REQUEST`, `FAILURE`, and `SUCCESS`. Like previously mentioned, these calculations are the same for every API call unless customized with some extra parameters when initializing the reducer. So what do we do for each action type?

- Request: update state with a loading variable set to `true`
- Failure: update state with the errors received from the API and set the loading flag to `false`
- Success: update state with the response from the API and set the loading flag to `false`

The root level of state is `state`, which contains all the state for the app.
We have designed our reducers to write state in the following way:

>endpoint -> method -> id

This separates our data out nicely and allows quick and easy access to exactly what we need based on the endpoint and method.

In the usage example, we select the reading plan data with the `getPlansModel` selector. The next section will dive into selectors, but just know that the selector is accessing `state.api.readingPlans.view[plan_id].response` to retrieve the reading plan.

The `readingPlans.view[plan_id].response` portion is built with our reading plans reducer, as previously described, and the `state.api` portion will be explained in the 4th step (updating data store with reducer).

#### Selectors: Access the current app state

Selectors are the interface our views use to access the application state populated by the reducers. There are two kinds of selectors; one we'll call plain selectors (or simply, selectors), and the other are [memoized selectors](https://github.com/reactjs/reselect).

###### Plain Selectors

Plain selectors simply retrieve a piece of app state. A `readingPlansSelector` would look like this:

``` javascript
export const readingPlansSelector = (state) => {
	return state.api
		&& state.api.readingPlans
		&& state.api.readingPlans.view
}
```

We place these plain selector functions right inside our `reducer.js` file because they access state that is structured by the reducer itself. If we change the reducer then we most likely need to change the selector as well.

This function just checks to see if we have any reading plan view call responses and returns them if we do. Remember that the view call is populated such that the state structure is: `readingPlans.view[plan_id].response`. So if we've made a (successful) view call with a plan_id of 991, then this selector would return the following object:

``` javascript
{
	991: {
		errors: false,
		loading: false,
		response: {
	   about:{
	      text:{
	         default: "Discover the wisdom of Oswald Chambers, author of My Utmost for His Highest, in this treasury of insights about prayer. Each reading features quotations from Chambers along with questions for your own personal reflection. As he inspires and challenges you with his simple and direct biblical wisdom, you will find yourself wanting to spend more time communicating with God.",
	         en: "Discover the wisdom of Oswald Chambers, author of My Utmost for His Highest, in this treasury of insights about prayer. Each reading features quotations from Chambers along with questions for your own personal reflection. As he inspires and challenges you with his simple and direct biblical wisdom, you will find yourself wanting to spend more time communicating with God."
	      },
	      html:{
	         "default": null
	      }
	   },
	   name:{
	      default: "Oswald Chambers: Prayer - A Holy Occupation",
	      en: "Oswald Chambers: Prayer - A Holy Occupation"
	   },
	   copyright:{
	      text:{
	         default: "We would like to thank Discovery House Publishers for providing this plan. For more information, please visit: www.utmost.org",
	         en: "We would like to thank Discovery House Publishers for providing this plan. For more information, please visit: www.utmost.org"
	      },
	      html:{
	         default: null
	      }
	   },
	   "short_url": "http://yvstaging.com/r/Fz",
	   "updated_dt": "2016-07-25T19:52:02.444152+00:00",
	   "version_id": null,
	   slug: "oswald-chambers-prayer-a-holy-occupation",
	   "has_devotional_audio": false,
	   "total_days": 30,
	   "created_dt": "2015-04-28T16:56:55.001777+00:00",
	   "publisher_url": "http://www.utmost.org/",
	   images:[
	      {
	         url: "//s3.amazonaws.com/yvplans-staging/991/320x320.jpg",
	         width: 320,
	         height: 320
	      },
	      {
	         url: "//s3.amazonaws.com/yvplans-staging/991/160x160.jpg",
	         width: 160,
	         height: 160
	      },
	      {
	         url: "//s3.amazonaws.com/yvplans-staging/991/80x80.jpg",
	         width: 80,
	         height: 80
	      },
	      {
	         url: "//s3.amazonaws.com/yvplans-staging/991/1440x810.jpg",
	         width: 1440,
	         height: 810
	      },
	      {
	         url: "//s3.amazonaws.com/yvplans-staging/991/1280x720.jpg",
	         width: 1280,
	         height: 720
	      },
	      {
	         url: "//s3.amazonaws.com/yvplans-staging/991/720x405.jpg",
	         width: 720,
	         height: 405
	      },
	      {
	         url: "//s3.amazonaws.com/yvplans-staging/991/640x360.jpg",
	         width: 640,
	         height: 360
	      },
	      {
	         url: "//s3.amazonaws.com/yvplans-staging/991/320x180.jpg",
	         width: 320,
	         height: 180
	      }
	   ],
	   "default_start_dt": null,
	   "formatted_length": {
	      default: "30 Days",
	      en: "30 Days"
	   },
	   type: "devotional",
	   id: 991,
	   cacheLifetime: 604800
		}
	}
}
```

###### Memoized Selectors

For pieces of data where we want to do some sort of calculation before using it, we use memoized selectors provided by the [reselect library](https://github.com/reactjs/reselect).

These selectors have a few great advantages. Reselect says the following:

>Selectors can compute derived data, allowing Redux to store the minimal possible state.

>Selectors are efficient. A selector is not recomputed unless one of its arguments change.

>Selectors are composable. They can be used as input to other selectors.

The approach that I've been taking is to use memoized selectors to build pseudo classes, if you will, for each kind of data that we fetch. This provides a single source for all data related to a data type, provides the efficiency of doing a calculation on state data once and serving the cached value on subsequent calls with the same inputs, and a place for utility methods on a data kind.

For example, the `moments.js` selector contains the following code:

``` javascript
import { createSelector } from 'reselect'
import moment from 'moment'
import { getVerseColors, getColors, getLabels, getVotd, getConfiguration } from '../endpoints/moments/reducer'

const getMomentsModel = createSelector(
	// get each piece of state needed to build out the full model
	[ getVerseColors, getColors, getLabels, getVotd, getConfiguration ],
	(verseColors, colors, labels, votd, configuration) => {
		const momentsModel = {}

		// CONFIGURATION ---------------------------------------
		if (configuration) {
			momentsModel.configuration = configuration
		}

		// VERSE COLORS ----------------------------------------
		if (verseColors) {
			momentsModel.verseColors = verseColors
		}

		// COLORS ----------------------------------------------
		if (colors) {
			momentsModel.colors = colors
		}

		// LABELS ----------------------------------------------
		if (labels) {
			const byCount = labels
			const byAlphabetical = labels.sort((a, b) => {
				// sort takes a function to compare elements
				// return -1 if value should be before second element
				// return 1 if value should be after
				// return 0 if values are equal
				// localeCompare does lowercase and unicode compare
				// we can also pass in language_tag for locale
				return a.label.toLowerCase().localeCompare(b.label.toLowerCase(), { sensitivity: 'base' })
			})

			// if the first sorted label is not an alphabetical character set up the swagtag header
			// we need to do this so we don't keep setting the # multiple times for different labels
			// in the following loop
			if (!byAlphabetical[0].label.charAt(0).match(/^[a-zA-Z]/)) {
				byAlphabetical[0].groupHeading = '#'
			} else {
				byAlphabetical[0].groupHeading = byAlphabetical[0].label.charAt(0).toUpperCase()
			}

			// build headers for alphabetic groupings
			// compare the first character of each label
			// if the label starts with a letter set up the header once per letter appearance
			for (let index = 2; index < byAlphabetical.length; index++) {
				if (index < byAlphabetical.length) {
					const a = byAlphabetical[index - 1]
					const b = byAlphabetical[index]

					if (b.label.charAt(0).match(/^[a-zA-Z]/) && (a.label.charAt(0).toLowerCase().localeCompare(b.label.charAt(0).toLowerCase(), { sensitivity: 'base' })) !== 0) {
						b.groupHeading = b.label.charAt(0).toUpperCase()
					} else {
						b.groupHeading = null
					}
				}
			}
			momentsModel.labels = { byCount, byAlphabetical }
		}

		// VOTD ------------------------------------------------
		if (votd) {
			momentsModel.votd = votd
		}

		// utility functions on model
		momentsModel.pullVotd = (dayOfYear = moment().dayOfYear()) => {
			const dayIndex = parseInt(dayOfYear, 10) - 1
			if (
				momentsModel.votd
				&& momentsModel.votd.length > 0
				&& dayIndex in momentsModel.votd
			) {
				return momentsModel.votd[dayIndex]
			}
			return null
		}


		return momentsModel
	}
)

export default getMomentsModel

```

As you can see, we have a (possibly) computationally expensive calculation for sorting a user's bookmark labels. Why would we want to do this sort every time we accessed the data, even if the label data hasn't changed? This is where the memoized selector comes in: it returns the cached version of the previous calculation if the input values to the selector haven't changed.

Note that the inputs to the memoized selector are the plain selectors for retrieving the pieces of state that relate to the model.

Utility functions also add some nice reusable calculations to the views importing the model, such as the votd function here, or the verse image filtering functionality in the `images.js` model.

Lastly, our views only need to have the following code to access every moment data that has been populated and utility functions:

``` javascript
import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
// selectors
import { getMomentsModel } from '@youversion/api-redux/lib/models/moments'

//
// other code
//

function mapStateToProps(state) {
	return {
		moments: getMomentsModel(state)
	}
}

export default connect(mapStateToProps, null)(PlanInfo)
```

###### When do I (not) create a memoized selector?

The only time I wouldn't combine plain selectors into a class is when the selector for a piece of data is standalone. If there is no other data related and no calculation on the data, then I would just keep the plain selector. A good example of this is our `getAuth` selector in `/src/models/index.js`.

#### Updating the app data store in `/standalone/PlanDiscovery/reducer.js` to include the new reducer

So we have actions to retrieve data from the API, reducers to populate our application state with said data, and selectors to provide an interface for our views to get the data from state.

Why isn't the data actually showing up in the app state?

We need to set up our app state with a `/standalone/PlanDiscovery/reducer.js` file which imports each separate reducer (like the reading plans one we just showed) and then use that reducer along with store creation functions supplied by `redux`. Our reading plans reducer.js file is imported in the `/features/PlanDiscovery/reducers/api.js` file, which is then imported into the standalone reducer like so:

``` javascript
import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import api from '../../features/PlanDiscovery/reducers/api'

const rootReducer = combineReducers({
	// for all the reducers being autopopulated by the api actions
	api,
})

export default rootReducer
```

The `'../../features/PlanDiscovery/reducers/api'` file looks very similar to this one, but combines all the reducers for PlanDiscovery. `api` is the result of a that reducer combination.

The function in `/standalone/PlanDiscovery/store.js` takes the standalone reducer and builds out the app state.

Now our reading plan view calls can be accessed like so:

`state.api.readingPlans.view[plan_id].response`


#### Whitelist the new endpoint in `/middleware/youversionapi.js` to ensure middleware cooperation

The last thing we need to do in order for our API calls to actually work, is to whitelist the endpoint in our middleware. If the middleware doesn't find the endpoint name in this list, it returns an error.

There is code in `/middleware/youversionapi.js` that looks like this:

``` javascript
const endpoints = [
	'events',
	'search',
	'users',
	'bible',
	'moments',
	'audio-bible',
	'notifications',
	'streaks',
	'friendships',
	'localization',
	'images'
]
```

We just need to add `reading-plans` to this list, and we'll be ready to go!

---

## Server rendering

For views we want search engines to be able to crawl, we will need to load data and render on the server.

If server rendering is necessary then we may have code for the api call in multiple places: one in a function that gets called before a route gets rendered (for the server rendering, see any `/standalone/loadData.js`), and one when the actual component mounts (in case the component mounts somewhere without having previously loaded the required data).

In order to make our components more...uh, componentized (reusable)...we may place a check whether the data needed for the component has already been fetched (such as in a server rendered component) and if not, then make the fetch calls from the client-rendered component.

Whether a component will always be server rendered, always fetch data on the client, or only accept data as props and not fetch data at all, all depends on the engineer writing the component whilst taking into consideration all the requirements for the component.
