import React, { Component, PropTypes } from 'react'
import Row from '../../../components/Row'
import Column from '../../../components/Column'

class EventViewContentAnnouncement extends Component {

	toggle(e) {
		e.target.previousSibling.classList.toggle('show')
	}

	render() {
		const { contentData } = this.props

		return (
			<div className='content announcement'>
				<div className='title'>{contentData.title}</div>
				<div className='caption' dangerouslySetInnerHTML={{__html: contentData.body}} />
				<a className='toggle' onClick={::this.toggle}>toggle</a>
			</div>
		)
	}

}

EventViewContentAnnouncement.propTypes = {

}

export default EventViewContentAnnouncement
