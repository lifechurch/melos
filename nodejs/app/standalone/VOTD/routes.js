import React from 'react'
import { Route } from 'react-router'
import VOTDView from '../../containers/VOTDView'

export default () => {
	return (
		<Route path="/(:lang/)verse-of-the-day" component={VOTDView} />
	)
}