import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import EventEditDetailsForm from '../components/EventEditDetailsForm'
import { eventSetDetails, createEvent, updateEvent } from '../actions/eventCreate'

class EventEditDetails extends Component {

	constructor(props) {
		super(props)
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	handleChange(event) {
		const { name, value } = event.target
		const { dispatch } = this.props
		dispatch(eventSetDetails(name, value))
	}

	handleSubmit(submitEvent) {
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
		const { event } = this.props
		return (
			<div>
				<Helmet title="Event Details" />
				<EventEditDetailsForm event={event} handleChange={this.handleChange} handleSubmit={this.handleSubmit} />
			</div>
		)
	}
}

export default EventEditDetails