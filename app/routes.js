import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from './containers/App'
import EventFeedMine from './containers/EventFeedMine'
import EventEdit from './containers/EventEdit'
import EventEditDetails from './containers/EventEditDetails'
import EventEditLocationContainer from './containers/EventEditLocationContainer'
import EventEditContentContainer from './containers/EventEditContentContainer'
import EventEditPreview from './containers/EventEditPreview'
import EventEditShare from './containers/EventEditShare'

function onLeaveDetails(nextState, replace, callback) {
  console.log("On Leave Details!!!!")
  console.log(nextState, replace)
  callback()
}

export default (
  <Route path="/" component={App} >
  	<IndexRoute component={EventFeedMine} />
  	<Route path="/event/edit(/:id)" component={EventEdit} >
  		<IndexRoute component={EventEditDetails} onLeave={onLeaveDetails} />
  		<Route path="locations_and_times" component={EventEditLocationContainer} />
  		<Route path="content" component={EventEditContentContainer} />
  		<Route path="preview" component={EventEditPreview} />
  		<Route path="share" component={EventEditPreview} />
  	</Route>
  </Route>
)