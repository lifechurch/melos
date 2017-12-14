import React from 'react'
import { Route, IndexRoute } from 'react-router'
import BibleView from '../../containers/Bible'
import ReferenceView from '../../containers/ReferenceView'

export default function (requireChapterData, setupReference, handleParallelVersionChange) {
	return (
		<Route path="/">
			<Route path="(:lang/)bible(/:version)">
				<IndexRoute component={BibleView} onEnter={requireChapterData} />

				{/* if we attempt to match beyond /bible/ we're gonna setupReference */}
				<Route path="*" component={ReferenceView} onEnter={setupReference} onChange={handleParallelVersionChange} />
			</Route>
		</Route>
	)
}
