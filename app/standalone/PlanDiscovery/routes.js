import React from 'react'
import { Route, IndexRoute } from 'react-router'
import PlanDiscoveryView from '../../containers/PlanDiscoveryView'
import PlanCollectionView from '../../containers/PlanCollectionView'
import PlansView from '../../containers/PlansView'

export default function(requirePlanDiscoveryData, requirePlanCollectionData) {
	return (
		<Route path="/(:lang/)reading-plans" component={PlansView}>
			<IndexRoute component={PlanDiscoveryView} onEnter={requirePlanDiscoveryData} />
			<Route path="collection/:id" component={PlanCollectionView} onEnter={requirePlanCollectionData} />
		</Route>
	)
}
