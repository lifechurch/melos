import React from 'react'
import { Route, IndexRoute } from 'react-router'
import VOTDView from '../../containers/VOTDView'
import VotdImage from '../../containers/VotdImage'

export default () => {
	return (
		<Route path="/">
			<Route path="/(:lang/)verse-of-the-day">
				<IndexRoute component={VOTDView} />
				<Route path=":usfm(/:image_id)" component={VotdImage} />
			</Route>
		</Route>
	)
}
