import React, { Component, PropTypes } from 'react'
import Row from '../../../components/Row'
import Column from '../../../components/Column'
import Image from '../../../components/Image'

class EventViewContentImage extends Component {

	render() {
		const { contentData } = this.props

		return (
			<div className='content image'>
				<Image images={contentData.urls} width={640} height={640} />
				{contentData.body ? <p className='caption'>{contentData.body}</p> : null}
			</div>
		)
	}

}

EventViewContentImage.propTypes = {

}

export default EventViewContentImage
