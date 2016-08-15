import React from 'react'
import { Route, IndexRoute } from 'react-router'
import PlanDiscoveryView from '../../containers/PlanDiscoveryView'
import PlanCollectionView from '../../containers/PlanCollectionView'
import PlansView from '../../containers/PlansView'
import AboutPlanView from '../../containers/AboutPlanView'

export default function(requireEvent) {
	return (
		<Route path="/(:lang/)reading-plans" component={PlansView}>
			<IndexRoute component={PlanDiscoveryView} />
			<Route path=":id(-:slug)" component={AboutPlanView} onEnter={requirePlanData} />
			<Route path="collection/:id" component={PlanCollectionView} />
		</Route>
	)
}
