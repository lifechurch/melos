import { createSelector } from 'reselect'
import { getSearchPlans } from '../endpoints/search/reducer'


const getSearchModel = createSelector(
	// get each piece of state needed to build out the full model
	[ getSearchPlans ],
	(plans) => {
		const searchModel = {}

		if (plans) {
			searchModel.plans = plans
		}

		return searchModel
	}
)

export default getSearchModel
