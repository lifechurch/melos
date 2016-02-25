import React, { Component, PropTypes } from 'react'
import Row from '../../../../../../app/components/Row'
import Column from '../../../../../../app/components/Column'

class PreviewTypeText extends Component {

	render() {
		const { contentData } = this.props

		return (
			<div className='type text'>
				<div className='caption' dangerouslySetInnerHTML={{__html: contentData.body}} />
				<div className='meta'>
					<div className='notes'>Add your notes…</div>
					<div className='actions'>&bull; &bull; &bull;</div>
				</div>
			</div>
		)
	}

}

PreviewTypeText.propTypes = {

}

export default PreviewTypeText
