import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Row from '../../../../../../app/components/Row'
import Column from '../../../../../../app/components/Column'
import Image from '../../../../../../app/components/Image'
import { FormattedMessage } from 'react-intl'

class PreviewTypeImage extends Component {

	render() {
		const { contentData } = this.props

		let images = []
		if (contentData.urls) {
			images = contentData.urls.filter((i) => { if (i.width == 640 && i.height == 640) { return true } })
		}
		const image_url = images.length ? images[0].url : false

		return (
			<div className='type image'>
				<div className="img-box">
					<div className="img-bkg" style={{ backgroundImage: `url(${image_url})` }} />
				</div>
				<p className='caption'>{contentData.body}</p>
				<div className='meta'>
					<div className='notes'><FormattedMessage id="features.EventEdit.features.preview.notes.prompt" /></div>
					<div className='actions'>&bull; &bull; &bull;</div>
				</div>
			</div>
		)
	}

}

PreviewTypeImage.propTypes = {

}

export default PreviewTypeImage
