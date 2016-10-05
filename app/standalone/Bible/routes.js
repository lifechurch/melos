import React from 'react'
import { Route, IndexRoute } from 'react-router'
import BibleView from '../../containers/Bible'

export default function(requireBibleData) {
	return (
		<Route path="/">
			<Route path="(:lang/)bible(/:version/)(:ref)" component={BibleView} onEnter={requireBibleData} />
		</Route>
	)
}