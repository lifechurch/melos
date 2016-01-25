import React, { Component, PropTypes } from 'react'
import ImageDrop from './ImageDrop'
import Row from '../../../../../../app/components/Row'
import Column from '../../../../../../app/components/Column'
import { Link } from 'react-router'
import FormField from '../../../../../../app/components/FormField'
import Input from '../../../../../../app/components/Input'
import Select from '../../../../../../app/components/Select'
import Textarea from '../../../../../../app/components/Textarea'

class DetailsEdit extends Component {
	render() {
		const { handleChange, handleNext, event, params } = this.props
		return (
			<form className="event-edit-details-form">
				<Row>
					<div className="medium-10 large-8 columns small-centered">
						<FormField InputType={Input} size='large' placeholder='Event Name' name='title' onChange={handleChange} value={event.item.title} errors={event.errors.fields.title} />
					</div>
				</Row>
				
				<ImageDrop />
				
				<Row>
					<div className="medium-10 large-8 columns small-centered">
						<FormField InputType={Input} size='medium' placeholder="Church Name or Organization" name="org_name" onChange={handleChange} value={event.item.org_name} errors={event.errors.fields.org_name} />
					</div>
				</Row>

				<Row>
					<div className="medium-10 large-8 columns small-centered">
						<FormField InputType={Textarea} placeholder="Event Description" name="description" onChange={handleChange} value={event.item.description} errors={event.errors.fields.description} />
					</div>
				</Row>
				
				<Row>
					<Column s='medium-12' a='right'>
						<a disabled={event.errors.hasError} onClick={handleNext}>Next: Add Location & Times</a>
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