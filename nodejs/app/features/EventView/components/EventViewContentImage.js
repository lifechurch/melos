import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Row from '../../../components/Row'
import Column from '../../../components/Column'
import Image from '../../../components/Image'

class EventViewContentImage extends Component {

	render() {
		const { contentData } = this.props

		let images = []
		if (contentData.urls) {
			images = contentData.urls.filter((i) => { if (i.width == 640 && i.height == 640) { return true } })
		}
		const image_url = images.length ? images[0].url : false

		return (
			<div className='content image'>
				<div className="img-box">
					<div className="img-bkg" style={{ backgroundImage: `url(${image_url})` }} />
				</div>
				{contentData.body ? <p className='caption'>{contentData.body}</p> : null}
			</div>
		)
	}

}

EventViewContentImage.propTypes = {

}

export default EventViewContentImage
