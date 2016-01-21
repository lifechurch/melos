import React, { Component, PropTypes } from 'react'
import ImageDrop from './ImageDrop'
import Row from '../../../../../../app/components/Row'
import Column from '../../../../../../app/components/Column'
import { Link } from 'react-router'

class DetailsEdit extends Component {

	componentWillUnmount() {
		const { handleLeave } = this.props
		handleLeave()
	}

	render() {
		const { handleChange, handleNext, event } = this.props
		return (
			<form className="event-edit-details-form">
				<Row>
					<div className="medium-10 large-8 columns small-centered">
						<input type="text" className='large' placeholder="Event Name" name='title' onChange={handleChange} value={event.item.title} />
					</div>
				</Row>
				
				<ImageDrop />
				
				<Row>
					<div className="medium-10 large-8 columns small-centered">
						<input type="text" className='medium' placeholder="Church Name or Organization" name="org_name" onChange={handleChange} value={event.item.org_name} />
					</div>
				</Row>

				<Row>
					<div className="medium-10 large-8 columns small-centered">
						<textarea placeholder="Event Description" name="description" onChange={handleChange} value={event.item.description}></textarea>
					</div>
				</Row>
				
				<Row>
					<Column s='medium-12' a='right'>
						<a onClick={handleNext} disabled={!event.detailsValid}>Next: Add Location & Times</a>
					</Column>
				</Row>
			</form>
		)
	}

}

DetailsEdit.propTypes = {
	handleChange: PropTypes.func.isRequired,
	handleNext: PropTypes.func.isRequired,
	handleLeave: PropTypes.func.isRequired,
	event: PropTypes.object.isRequired
}

export default DetailsEdit