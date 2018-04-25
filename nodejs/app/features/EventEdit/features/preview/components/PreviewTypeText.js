import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Row from '../../../../../../app/components/Row'
import Column from '../../../../../../app/components/Column'
import { FormattedMessage } from 'react-intl'

class PreviewTypeText extends Component {

	render() {
		const { contentData } = this.props

		return (
			<div className='type text'>
				<div className='caption' dangerouslySetInnerHTML={{ __html: contentData.body }} />
				<div className='meta'>
					<div className='notes'><FormattedMessage id="features.EventEdit.features.preview.notes.prompt" /></div>
					<div className='actions'>&bull; &bull; &bull;</div>
				</div>
			</div>
		)
	}

}

PreviewTypeText.propTypes = {

}

export default PreviewTypeText
