import readingPlansAction from '../endpoints/readingPlans/action'
import participantsView from '../batchedActions/participantsUsersView'

function planView({ plan_id, together_id, token = null, auth, serverLanguageTag }) {
	return (dispatch) => {
		return new Promise((resolve) => {
			dispatch(readingPlansAction({
				method: 'view',
				params: {
					id: plan_id,
				},
				auth: !!auth
			})).then((data) => { resolve(data) })
			if (together_id) {
				dispatch(participantsView({
					together_id,
					token,
					auth,
					serverLanguageTag
				}))
			}
		})
	}
}

export default planView
