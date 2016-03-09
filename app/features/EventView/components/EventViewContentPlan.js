import React, { Component, PropTypes } from 'react'
import Row from '../../../components/Row'
import Column from '../../../components/Column'
import Image from '../../../components/Image'

class EventViewContentPlan extends Component {

	render() {
		const { contentData } = this.props

		var image

		if (contentData.images && contentData.images.length > 0) {
			image = <a target="_blank" href={contentData.shorturl}><Image images={contentData.images} width={640} height={360} /></a>
		}

		return (
			<div className='content plan'>
				{image}
				<p className='title'><a target="_blank" href={contentData.shorturl}>{contentData.title}</a></p>
				<p className='length'>{contentData.formatted_length}</p>
			</div>
		)
	}

}

EventViewContentPlan.propTypes = {

}

export default EventViewContentPlan
