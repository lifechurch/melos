import React from 'react'
import { Route, IndexRoute } from 'react-router'
import BibleView from '../../containers/Bible'
import PassageView from '../../containers/PassageView'

export default function (requireChapterData, requireVerseData) {
	return (
		<Route path="/">
			<Route path="(:lang/)bible(/:version)">
				<IndexRoute component={BibleView} onEnter={requireChapterData} />
				<Route path="(:book).(:chapter).(:verse).:vabbr" component={PassageView} onEnter={requireVerseData} />
				<Route path="(:book).(:chapter).(:vabbr)" component={BibleView} onEnter={requireChapterData} />
			</Route>
		</Route>
	)
}
