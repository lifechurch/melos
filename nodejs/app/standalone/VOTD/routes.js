import React from 'react'
import { Route } from 'react-router'
import VOTDView from '../../containers/VOTDView'

export default function () {
	return (
		<Route path="/(:lang/)verse-of-the-day/:day" component={VOTDView} />
	)
}
