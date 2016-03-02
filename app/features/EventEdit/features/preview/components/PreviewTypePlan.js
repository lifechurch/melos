import React, { Component, PropTypes } from 'react'
import Row from '../../../../../../app/components/Row'
import Column from '../../../../../../app/components/Column'
import Image from '../../../../../../app/components/Image'

class PreviewTypePlan extends Component {

	render() {
		const { contentData } = this.props

		return (
			<div className='type plan'>
				<Image images={contentData.images} width={640} height={360} />
				<p className='title'>{contentData.title}</p>
				<p className='length'>{contentData.formatted_length}</p>
				<div className='meta'>
					<div className='notes'>Read</div>
					<div className='notes'>Plan Info</div>
				</div>
			</div>
		)
	}

}

PreviewTypePlan.propTypes = {

}

export default PreviewTypePlan
