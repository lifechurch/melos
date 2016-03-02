import React, { Component, PropTypes } from 'react'
import Row from '../../../../../../app/components/Row'
import Column from '../../../../../../app/components/Column'

class PreviewTypePlan extends Component {

	render() {
		const { contentData } = this.props
		var PlanImage = contentData.images ? <img src={contentData.images[6].url} /> : null

		return (
			<div className='type plan'>
				{PlanImage}
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
