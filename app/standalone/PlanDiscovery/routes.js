import React from 'react'
import { Route } from 'react-router'
import PlanDiscoveryView from '../../containers/PlanDiscoveryView'

export default function(requireEvent) {
	return (
		<Route path="/(:lang/)reading-plans" component={PlanDiscoveryView}  />
	)
}
