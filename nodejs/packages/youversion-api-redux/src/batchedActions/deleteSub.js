import plansAPI from '../endpoints/plans'

const type = 'DELETE_SUB_FROM_STATE'

/**
 */
export default function deleteSub({ subscription_id, together_id }) {
	return (dispatch) => {
		dispatch({ type, data: { subscription_id, together_id } })
    // when we delete a sub from state, let's make sure our sw cache doesn't
    // keep around stale data
		return dispatch(plansAPI.actions.subscriptions.get({}, {
			auth: true,
			forceUpdateSWCache: true,
		}))
	}
}
