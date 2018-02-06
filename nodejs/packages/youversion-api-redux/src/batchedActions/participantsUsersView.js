import usersAction from '../endpoints/users/action'
import plansAPI from '../endpoints/plans'
import customGet from '../customHelpers/get'

function participantsView({ together_id, token = null, auth, serverLanguageTag }) {
	return (dispatch) => {
		return new Promise((resolve, reject) => {
			const pathvars = {
				id: together_id
			}
			if (token) {
				pathvars.token = token
			}

			customGet({
				actionName: 'participants',
				pathvars,
				dispatch,
				actions: plansAPI.actions,
				auth,
				serverLanguageTag,
			}).then((data) => {
				const promesan = [data]
				if (data && data.data) {
					data.data.forEach((user) => {
						promesan.push(
							dispatch(usersAction({
								method: 'view',
								params: {
									id: user.id,
								},
							}))
						)
					})
				}
				Promise.all(promesan).then((promisedLand) => {
					resolve(promisedLand)
				})
				.catch((err) => {
					reject(err)
				})
			})
			.catch((err) => {
				reject(err)
			})
		})
	}
}

export default participantsView
