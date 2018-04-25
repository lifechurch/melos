import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Row from '../../../../../../app/components/Row'
import Column from '../../../../../../app/components/Column'

class PreviewTypeLink extends Component {

	render() {
		const { contentData } = this.props
		let description = null

		if (contentData.body) {
			description = <p className='caption' dangerouslySetInnerHTML={{ __html: contentData.body }} />
		}

		return (
			<div className='type link'>
				<p className='title'>{contentData.title}</p>
				{description}
				<div className='meta'>
					<div className='notes'>
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
