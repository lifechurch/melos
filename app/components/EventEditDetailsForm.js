import React, { Component, PropTypes } from 'react'
import EventImageDrop from './EventImageDrop'
import Row from './Row'
import Column from './Column'
import { Link } from 'react-router'

class EventEditDetailsForm extends Component {
	render() {
		const { handleChange, handleSubmit, event  } = this.props
		return (
			<form className="event-edit-details-form">
				<Row>
					<div className="medium-10 large-8 columns small-centered">
						<input type="text" className='large' placeholder="Event Name" name='title' onChange={handleChange} />
					</div>
				</Row>
				
				<EventImageDrop />
				
				<Row>
					<div className="medium-10 large-8 columns small-centered">
						<input type="text" className='medium' placeholder="Church Name or Organization" name="org_name" onChange={handleChange} />
					</div>
				</Row>

				<Row>
					<div className="medium-10 large-8 columns small-centered">
						<textarea placeholder="Event Description" name="description" onChange={handleChange}></textarea>
					</div>
				</Row>
				
				<Row>
					<Column s='medium-12' a='right'>
						<a onClick={handleSubmit} disabled={!event.detailsValid}>Next: Add Location & Times</a>
					</Column>
				</Row>
			</form>
		)
	}
}

EventEditDetailsForm.propTypes = {
	handleChange: PropTypes.func.isRequired,
	handleSubmit: PropTypes.func.isRequired,
	event: PropTypes.object.isRequired
}

export default EventEditDetailsForm