import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'

class EventEditContent extends Component {
	render() {
		const { ev } = this.props
		return (
			<div>
				<Helmet title="Event Content" />
				Content
				{ev.title}
			</div>
		)
	}
}

export default EventEditContent