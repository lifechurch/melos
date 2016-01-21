import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import DetailsEdit from '../features/EventEdit/features/details/components/DetailsEdit'
import { eventSetDetails, createEvent, updateEvent } from '../actions/eventCreate'

class EventEditDetails extends Component {

	handleChange(changeEvent) {
		const { name, value } = changeEvent.target
		const { dispatch } = this.props
		dispatch(eventSetDetails(name, value))
	}

	handleNext(clickEvent) {
		const { history, router } = this.context
		router.push('/frank')
		history.push('/bob')
	}

	handleLeave() {
		const { dispatch, event } = this.props
		if (event.detailsValid) {
			if (event.item.id) {
				dispatch(updateEvent(event.item))
			} else {
				dispatch(createEvent(event.item))
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