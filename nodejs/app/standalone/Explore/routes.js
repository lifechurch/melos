import React from 'react'
import { Route } from 'react-router'
import ExploreView from '../../containers/ExploreView'

export default () => {
	return (
		<Route path="/(:lang/)explore" component={ExploreView} />
	)
}
