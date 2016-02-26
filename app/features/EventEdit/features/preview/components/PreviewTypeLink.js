import React, { Component, PropTypes } from 'react'
import Row from '../../../../../../app/components/Row'
import Column from '../../../../../../app/components/Column'

class PreviewTypeLink extends Component {

	render() {
		const { contentData } = this.props
		var description = null

		if (contentData.body) {
			description = <p className='caption'>{contentData.body}</p>
		}

		return (
			<div className='type link'>
				{description}
				<div className='meta'>
					<div className='notes'>
						<p>{contentData.title}</p>
						<a href={contentData.url}>{contentData.url}</a>
					</div>
					<div className='actions'>&bull; &bull; &bull;</div>
				</div>
			</div>
		)
	}

}

PreviewTypeLink.propTypes = {

}

export default PreviewTypeLink
