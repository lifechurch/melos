import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import Row from '../../../components/Row'
import Column from '../../../components/Column'
import moment from 'moment'
import EventViewContent from './EventViewContent'

class EventViewFeed extends Component {
	render() {
		const { dispatch, reference, event } = this.props
		const { content } = event.item

		const contentList = content.map((c,i) => {
			switch (c.type) {
				default: return <EventViewContent content={c} index={i} dispatch={dispatch} reference={reference} />
			}
		})

		return (
			<div className="feed">
				{contentList}
			</div>
		)
	}
}

export default EventViewFeed
