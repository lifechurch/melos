import getCurrentDT from '@youversion/utils/lib/time/getCurrentDT'
import plansAPI from '../endpoints/plans'

function subscribeToPlan({
	plan_id,
	start_dt = getCurrentDT(),
	isTogether = false,
	privacy = 'private',
	auth,
	serverLanguageTag,
	onComplete = null
}) {
	return (dispatch) => {
		const created_dt = getCurrentDT()
		dispatch(plansAPI.actions.subscriptions.post({}, {
			body: {
				created_dt,
				start_dt,
				plan_id,
				privacy,
				together: isTogether,
				language_tag: serverLanguageTag,
			},
			auth
		})).then((data) => {
			if (data && data.map) {
				const newSubId = data.map.filter((subId) => {
					return data.data[subId]
						&& data.data[subId].created_dt === created_dt
				})[0]
				const sub = data.data[newSubId]
				if (onComplete) {
					onComplete(sub)
				}
			}
		})
	}
}

export default subscribeToPlan
