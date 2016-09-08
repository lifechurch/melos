import React from 'react'
import { Route, IndexRoute } from 'react-router'
import SaveForLaterView from '../../features/SaveForLater/components/SaveForLaterView'

export default function() {
	return (
		<Route path="/(:lang/)reading-plans/:id(-:slug)/save-for-later" component={SaveForLaterView} />
	)
}