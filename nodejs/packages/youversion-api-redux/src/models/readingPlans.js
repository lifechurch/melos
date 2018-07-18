import { createSelector } from 'reselect'
import Immutable from 'immutable'
import selectImageFromList from '@youversion/utils/lib/images/selectImageFromList'
import { getConfiguration, getPlans, getPlansByReference } from '../endpoints/readingPlans/reducer'
import { getPlanDays } from '../endpoints/plans'

const getPlansModel = createSelector(
	// get each piece of state needed to build out the full model
	[ getConfiguration, getPlans, getPlanDays, getPlansByReference ],
	(configuration, plans, days, plansByReference) => {
		const plansModel = { byId: {}, allIds: [] }

		// CONFIGURATION
		if (configuration) {
			plansModel.configuration = configuration
		}

		// PLANS VIEW
		if (plans) {
			const planIds = Object.keys(plans)
			planIds.forEach((id) => {
				if (typeof plans[id] === 'object' && 'response' in plans[id] && 'id' in plans[id].response) {
					plansModel.byId = Immutable
						.fromJS(plansModel.byId)
						.mergeDeepIn([id], plans[id].response)
						.toJS()
				}
			})
		}

		// DAYS
		if (days) {
			// let's break out the references segments so we can access any segment
			// (devo, ref, talk-it-over) by its index
			// [MAT.1, JHN.2.3+JHN.2.4]
			// will become
			// { kind: "reference", content: [MAT.1] },
			// { kind: "reference", content: [JHN.2.3+JHN.2.4] }

			// grab days array
			Object.keys(days).forEach((id) => {
				const daysData = days[id]
				const newDaysData = {}
				Object.keys(daysData).forEach((dayNum) => {
					const day = daysData[dayNum]
					const newSegs = []
					// break out new segments array for each plan day
					if (day.segments) {
						day.segments.forEach((seg) => {
							// if segment is list of references,
							// break out each usfm into its own segment in the new array
							if (seg.kind === 'reference') {
								seg.content.forEach((usfm) => {
									newSegs.push(
										{
											kind: 'reference',
											content: usfm
										}
									)
								})
							} else {
								// leave non ref segments alone
								newSegs.push(seg)
							}
						})
					}
					// push the new day object we just built
					newDaysData[dayNum] = Immutable
						.fromJS(day)
						.merge({ segments: newSegs.length > 0 ? newSegs : null })
						.toJS()
				})

				plansModel.byId = Immutable
					.fromJS(plansModel.byId)
					.mergeDeepIn([id], { days: newDaysData })
					.toJS()
			})
		}

		// PLANS BY REFERENCE
		if (plansByReference) {
			plansModel.plans_by_reference = plansByReference
		}

		plansModel.allIds = Object.keys(plansModel.byId)

		// utility functions
		plansModel.getPlanImgs = ({ id, width = null, height = null }) => {
			let imgs = []
			if (id in plansModel.byId) {
				imgs = plansModel.byId[id]
					&& plansModel.byId[id].images
				// if we're asking for a specific img let's return it
				if (width && height) {
					return selectImageFromList({
						images: imgs,
						width,
						height
					})
				}
			}
			// otherwise just return the list for the plan
			return imgs
		}

		return plansModel
	}
)

export default getPlansModel
