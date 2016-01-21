import React, { Component } from 'react'
import Row from './Row'
import Column from './Column'
import EventEditNav from '../features/EventEdit/components/EventEditNav'

class EventHeader extends Component {
	render() {
		return (
			<div className='event-header'>
				<Row>
					<Column s='medium-4'>
						Cancel
					</Column>

					<Column s='medium-4' a='center'>
						EVENT BUILDER
					</Column>

					<Column s='medium-4' a='right'>
						First Lastname
					</Column>
				</Row>

				<Row>
					<Column s='medium-6'>
						<EventEditNav {...this.props} />						
					</Column>

					<Column s='medium-6' a='right'>
						<a className='solid-button gray'>Save as Draft</a>&nbsp;
						<a className='solid-button green'>Publish</a>
					</Column>
				</Row>
			</div>
		)
	}
}

export default EventHeader