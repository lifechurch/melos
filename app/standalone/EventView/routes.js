import React from 'react'
import { Route } from 'react-router'
import EventView from '../../containers/EventView'

export default function(requireEvent) {
	return (
		<Route path="/events/:id" component={EventView}  />
	)
}
