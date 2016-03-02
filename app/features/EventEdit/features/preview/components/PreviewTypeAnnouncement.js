import React, { Component, PropTypes } from 'react'
import Row from '../../../../../../app/components/Row'
import Column from '../../../../../../app/components/Column'

class PreviewTypeAnnouncement extends Component {

	toggle(e) {
		e.target.previousSibling.classList.toggle('show')
	}

	render() {
		const { contentData } = this.props

		return (
			<div className='type announcement'>
				<div className='title'>{contentData.title}</div>
				<div className='caption' dangerouslySetInnerHTML={{__html: contentData.body}} />
				<a className='toggle' onClick={::this.toggle}>toggle</a>
			</div>
		)
	}

}

PreviewTypeAnnouncement.propTypes = {

}

export default PreviewTypeAnnouncement
