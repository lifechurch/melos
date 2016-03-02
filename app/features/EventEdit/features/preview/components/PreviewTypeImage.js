import React, { Component, PropTypes } from 'react'
import Row from '../../../../../../app/components/Row'
import Column from '../../../../../../app/components/Column'
import Image from '../../../../../../app/components/Image'

class PreviewTypeImage extends Component {

	render() {
		const { contentData } = this.props

		return (
			<div className='type image'>
				<Image images={contentData.urls} width={640} height={640} />
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
