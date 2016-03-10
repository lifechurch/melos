import React, { Component, PropTypes } from 'react'
import Row from '../../../components/Row'
import Column from '../../../components/Column'

class EventViewContentAnnouncement extends Component {

	toggle(e) {
		e.target.nextSibling.classList.toggle('show')
		e.target.text = e.target.text=='expand' ? 'collapse' : 'expand'
	}

	render() {
		const { contentData } = this.props

		return (
			<div className='content announcement'>
				<div className='title left'>{contentData.title}</div>
				<a className='toggle right' onClick={::this.toggle}>expand</a>
				<div className='caption' dangerouslySetInnerHTML={{__html: contentData.body}} />
			</div>
		)
	}

}

EventViewContentAnnouncement.propTypes = {

}

export default EventViewContentAnnouncement
