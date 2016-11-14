import React from 'react'
import { Route, IndexRoute } from 'react-router'
import BibleView from '../../containers/Bible'
import VersePageView from '../../containers/VersePageView'

export default function(requireBibleData) {
	return (
		<Route path="/">
			<Route path="(:lang/)bible(/:version/)(:ref)" component={BibleView} onEnter={requireBibleData} />
			<Route path="(:lang/)bible/:ref" component={VersePageView} onEnter={requireVerseData} />
		</Route>
	)
}