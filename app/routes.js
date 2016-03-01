import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from './containers/App'
import EventFeedMine from './containers/EventFeedMine'
import EventEdit from './containers/EventEdit'
import EventEditDetails from './containers/EventEditDetails'
import Auth from './containers/Auth'
import EventEditLocationContainer from './containers/EventEditLocationContainer'
import EventEditContentContainer from './containers/EventEditContentContainer'
import EventEditPreview from './containers/EventEditPreview'
import EventEditShare from './containers/EventEditShare'

export default function(requireAuth, requireEvent) {
	return (
		<Route path="/" component={App} onEnter={requireAuth}>
			<IndexRoute component={EventFeedMine} />
			<Route path="/login" component={Auth} />
			<Route path="/event/edit(/:id)" component={EventEdit} >
				<IndexRoute component={EventEditDetails} onEnter={requireEvent} />
				<Route path="locations_and_times" component={EventEditLocationContainer} onEnter={requireEvent} />
				<Route path="content" component={EventEditContentContainer} onEnter={requireEvent} />
				<Route path="preview" component={EventEditPreview} onEnter={requireEvent} onEnter={requireEvent} />
				<Route path="share" component={EventEditShare} onEnter={requireEvent} />
			</Route>
		</Route>
	)
}