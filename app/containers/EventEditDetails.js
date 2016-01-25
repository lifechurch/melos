import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import DetailsEdit from '../features/EventEdit/features/details/components/DetailsEdit'
import ActionCreators from '../features/EventEdit/features/details/actions/creators'

class EventEditDetails extends Component {

	handleChange(changeEvent) {
		const { name, value } = changeEvent.target
		const { dispatch } = this.props
		dispatch(ActionCreators.setDetails(name, value))
	}

	handleNext(clickEvent) {
		const { event, dispatch } = this.props
		dispatch(ActionCreators.saveDetails(event.item, true))
	}

	handleLeave() {
		const { dispatch, event } = this.props
		if (event.detailsValid) {
			if (event.item.id) {
				dispatch(ActionCreators.update(event.item))
			} else {
				dispatch(ActionCreators.create(event.item))
			}
		}
	}

	render() {
		const { event, handleDetailsNext, params } = this.props
		return (
			<div>
				<Helmet title="Event Details" />
				<DetailsEdit event={event} params={params} handleChange={::this.handleChange} handleLeave={::this.handleLeave} handleNext={::this.handleNext} />
			</div>
		)
	}
}

export default EventEditDetails