import Immutable from 'immutable'
import isDayComplete from '@youversion/utils/lib/readingPlans/isDayComplete'
import getCurrentDT from '@youversion/utils/lib/time/getCurrentDT'
import deleteSub from './deleteSub'
import plansAPI from '../endpoints/plans'
import planView from './planView'


/**
 * recursive function to get all days for reading plan
 * @param  {[type]}  plan_id    [description]
 * @param  {Boolean} isTogether [description]
 * @param  {[type]}  [page=1    }]            [description]
 * @return {[type]}             [description]
 */
export function planDays({ plan_id, isTogether, page = 1 }) {
	return (dispatch) => {
		dispatch(plansAPI.actions.days.get({
			id: plan_id,
			together: isTogether,
			page,
		}, {
			auth: true
		})).then((data) => {
			if (Immutable.fromJS(data).getIn(['data', `${plan_id}`, 'next_page'], false)) {
				// recursively call this function until we have no more pages
				dispatch(planDays({ plan_id, isTogether, page: page + 1 }))
			}
		})
	}
}


/**
 * update progress for a subscription day
 * @param  {[type]} contentIndex    [description]
 * @param  {[type]} complete        [description]
 * @param  {[type]} daySegments     [description]
 * @param  {[type]} dayProgress     [description]
 * @param  {[type]} day             [description]
 * @param  {[type]} subscription_id [description]
 * @return {[type]}                 [description]
 */
export function subscriptionDayUpdate({
	contentIndex,
	complete,
	daySegments,
	dayProgress,
	day,
	subscription_id,
	isPlanComplete,
	markDayComplete,
}) {
	return (dispatch) => {
		// just mark the day complete and bypass the segment calculations
		if (markDayComplete) {
			return dispatch(plansAPI.actions.progressDay.put({
				id: subscription_id,
				day,
			}, {
				body: {
					partial: null,
					complete: true,
					updated_dt: getCurrentDT(),
				},
				auth: true,
			})).then(() => {
				if (isPlanComplete) {
					dispatch(deleteSub({ subscription_id }))
				}
			})
		} else {
			let partial
			// if we already have a completion list, set the new complete val
			if (dayProgress.partial) {
				partial = Immutable
					.fromJS(dayProgress.partial)
					.set(contentIndex, complete)
					.toJS()
			} else {
				// otherwise, we need to build out the list based off of the daysegments and
				// set the new complete val
				partial = daySegments.map((seg, i) => {
					// set the other segments to whether or not the day was complete
					// (if it was complete and now we're unchecking a seg, then we want
					// the other segs to be true, and vice versa)
					return contentIndex === i
						? complete
						: dayProgress.complete
				})
			}

			const dayComplete = isDayComplete(partial)

			return dispatch(plansAPI.actions.progressDay.put({
				id: subscription_id,
				day,
			}, {
				body: {
					partial: dayComplete ? null : partial,
					complete: dayComplete,
					updated_dt: getCurrentDT(),
				},
				auth: true,
			})).then(() => {
				if (isPlanComplete) {
					dispatch(deleteSub({ subscription_id }))
				}
			})
		}
	}
}


/**
 * get all relevant data for subscription day
 * @param  {[type]} subscription_id [description]
 * @param  {[type]} auth            [description]
 * @param  {[type]} day             [description]
 * @return {[type]}                 [description]
 */
function subscriptionData({ subscription_id, auth, day, serverLanguageTag }) {
	return (dispatch) => {
		return new Promise((resolve, reject) => {
			return dispatch(plansAPI.actions.subscription.get({ id: subscription_id }, { auth: true }))
				.then((data) => {
					if (!(data && data.data)) {
						reject()
					}
					const promises = []
					const sub = data &&
						Immutable
						.fromJS(data)
						.getIn(['data', `${subscription_id}`], false)
					if (sub) {
						const together_id = sub.toJS().together_id
						const plan_id = sub.toJS().plan_id
						// get sub data
						if (day) {
							promises.push(
								dispatch(plansAPI.actions.day.get({
									id: plan_id,
									day: parseInt(day, 10),
									together: !!together_id,
								}, {})).then(({ data: dayda }) => {
									// if this day doesn't have any segments then we want to mark it as complete
									if (
										dayda
										&& dayda[plan_id]
										&& dayda[plan_id][day]
										&& !dayda[plan_id][day].segments
									) {
										dispatch(subscriptionDayUpdate({
											markDayComplete: true,
											subscription_id,
											day,
										}))
									}
								})
							)
						}
						promises.push(
							dispatch(planView({
								plan_id,
								together_id,
								auth,
								serverLanguageTag
							}))
						)

						promises.push(
							dispatch(plansAPI.actions.progress.get({
								id: subscription_id,
								page: '*',
								fields: 'days'
							}, {
								auth: true
							})).catch((err) => {
								reject(err)
							})
						)

						// get together data if plan with friends
						if (together_id) {
							promises.push(
								dispatch(plansAPI.actions.together.get({ id: together_id }, { auth: true }))
							)
						}
					}
					return Promise.all(promises)
						.then((all) => { resolve(all) })
						.catch((err) => { reject(err) })
				})
				.catch((err) => {
					reject(err)
				})
		})
	}
}

export default subscriptionData
