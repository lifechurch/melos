import React, { Component, PropTypes } from 'react'
import Row from '../../../components/Row'
import Column from '../../../components/Column'

class EventViewContentText extends Component {

	render() {
		const { contentData } = this.props

		return (
			<div className='content text'>
				<div className='caption' dangerouslySetInnerHTML={{__html: contentData.body}} />
			</div>
		)
	}

}

EventViewContentText.propTypes = {

}

export default EventViewContentText
