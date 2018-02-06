import { createSelector } from 'reselect'
import { getTopics, getTopic } from '../endpoints/explore'


const getExploreModel = createSelector(
	// get each piece of state needed to build out the full model
	[ getTopics, getTopic ],
	(topics, topic) => {
		const exploreModel = { byTopic: {}, allTopics: [] }

		if (topics && topics.data && topics.data.length > 0) {
			exploreModel.allTopics = topics.data
		}

		if (topic) {
			exploreModel.byTopic = topic
		}
		return exploreModel
	}
)

export default getExploreModel
