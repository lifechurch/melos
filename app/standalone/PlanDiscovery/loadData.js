import ActionCreator from '../../features/PlanDiscovery/actions/creators'

export default function loadData(params, startingState, sessionData) {
	return new Promise((resolve, reject) => {
		resolve(ActionCreator.discoverAll({ language_tag: 'en' }, false))
	})
}