import React, { Component, PropTypes } from 'react'
import Row from '../../../../../../app/components/Row'
import Column from '../../../../../../app/components/Column'
import Image from '../../../../../../app/components/Image'
import { FormattedMessage } from 'react-intl'

class PreviewTypePlan extends Component {

	render() {
		const { contentData } = this.props

		return (
			<div className='type plan'>
				<Image images={contentData.images} width={640} height={360} />
				<p className='title'>{contentData.title}</p>
				<p className='length'>{contentData.formatted_length}</p>
				<div className='meta'>
					<div className='notes'><FormattedMessage id="features.EventEdit.features.preview.components.PreviewTypePlan.read" /></div>
					<div className='notes'><FormattedMessage id="features.EventEdit.features.preview.components.PreviewTypePlan.info" /></div>
				</div>
			</div>
		)
	}

}

PreviewTypePlan.propTypes = {

}

export default PreviewTypePlan
