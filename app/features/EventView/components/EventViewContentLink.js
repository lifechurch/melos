import React, { Component, PropTypes } from 'react'
import Row from '../../../components/Row'
import Column from '../../../components/Column'

class EventViewContentLink extends Component {

	render() {
		const { contentData } = this.props

		return (
			<div className='content url'>
				<p className='title'>{contentData.title}</p>
				{contentData.body ? <p className='caption' dangerouslySetInnerHTML={{__html: contentData.body}} /> : null}
				<a className='url' href={contentData.url}>{contentData.url}</a>
			</div>
		)
	}

}

EventViewContentLink.propTypes = {

}

export default EventViewContentLink
