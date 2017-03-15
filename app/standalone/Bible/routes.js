import React from 'react'
import { Route, IndexRoute } from 'react-router'
import BibleView from '../../containers/Bible'
import PassageView from '../../containers/PassageView'
import ReferenceView from '../../containers/ReferenceView'

export default function (requireChapterData, requireVerseData, setupReference) {
	return (
		<Route path="/">
			<Route path="(:lang/)bible(/:version)">
				<IndexRoute component={BibleView} onEnter={requireChapterData} />
				{/* <Route path="(:book).(:chapter).(:verse).:vabbr" component={PassageView} onEnter={requireVerseData} />
				<Route path="(:book).(:chapter).(:vabbr)" component={BibleView} onEnter={requireChapterData} />
				<Route path="(:book).(:chapter)" component={BibleView} onEnter={requireChapterData} /> */}

				{/* if we attempt to match beyond /bible/ we're gonna setupReference */}
				<Route path="*" component={ReferenceView} onEnter={setupReference} />
			</Route>
		</Route>
	)
}
