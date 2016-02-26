import React, { Component, PropTypes } from 'react'
import Row from '../../../../../../app/components/Row'
import Column from '../../../../../../app/components/Column'

class PreviewTypeImage extends Component {

	render() {
		const { contentData } = this.props

		return (
			<div className='type image'>
				<img src={contentData.urls[0].url} />
				<p className='caption'>{contentData.body}</p>
				<div className='meta'>
					<div className='notes'>Add your notes…</div>
					<div className='actions'>&bull; &bull; &bull;</div>
				</div>
			</div>
		)
	}

}

PreviewTypeImage.propTypes = {

}

export default PreviewTypeImage
