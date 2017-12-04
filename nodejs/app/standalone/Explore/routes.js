import React from 'react'
import { Route, IndexRoute } from 'react-router'
import ExploreView from '../../containers/ExploreView'
import TopicView from '../../containers/TopicView'

export default () => {
	return (
		<Route path="/(:lang/)explore">
			<IndexRoute component={ExploreView} />
			<Route path=":topic" component={TopicView} />
		</Route>
	)
}
