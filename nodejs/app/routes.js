import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from './containers/App'
import Auth from './containers/Auth'
import EventFeedMine from './containers/EventFeedMine'
import EventEdit from './containers/EventEdit'
import EventEditDetails from './containers/EventEditDetails'
import EventEditContentContainer from './containers/EventEditContentContainer'
import EventEditLocationContainer from './containers/EventEditLocationContainer'
import EventEditPreview from './containers/EventEditPreview'
import EventEditShare from './containers/EventEditShare'
import EventView from './containers/EventView'
import SelectLanguage from './containers/SelectLanguage'
import PlansView from './containers/PlansView'
import PlanDiscoveryView from './containers/PlanDiscoveryView'
import PlanCollectionView from './containers/PlanCollectionView'
import AboutPlanView from './containers/AboutPlanView'
import Bible from './containers/Bible'
import BibleAudio from './containers/BibleAudio'

export default function (requireAuth, requireEvent, requirePlanDiscoveryData, requirePlanCollectionData, requirePlanData) {
	return (
		<Route path="/(:locale(:/))" component={App} onEnter={requireAuth}>
			<IndexRoute component={EventFeedMine} />
			<Route path="select_language" component={SelectLanguage} />
			<Route path="login" component={Auth} />
			<Route path="event/edit(/:id)" component={EventEdit} >
				<IndexRoute component={EventEditDetails} onEnter={requireEvent} />
				<Route path="locations_and_times" component={EventEditLocationContainer} onEnter={requireEvent} />
				<Route path="content" component={EventEditContentContainer} onEnter={requireEvent} />
				<Route path="preview" component={EventEditPreview} onEnter={requireEvent} onEnter={requireEvent} />
				<Route path="share" component={EventEditShare} onEnter={requireEvent} />
			</Route>
			<Route path="event/view/:id" component={EventView} onEnter={requireEvent} />
			<Route path="bible" component={Bible} />
			<Route path="bible-audio-player" component={BibleAudio} />
		</Route>
	)
}
