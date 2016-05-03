import React, { Component, PropTypes } from 'react'
import Row from '../../../../../../app/components/Row'
import Column from '../../../../../../app/components/Column'

class PreviewTypeAnnouncement extends Component {

	toggle(e) {
		const { intl } = this.props
		e.target.previousSibling.classList.toggle('show')
		e.target.text = e.target.text== intl.formatMessage({id:"features.EventEdit.features.preview.components.PreviewTypeAnnouncement.expand"}) ? intl.formatMessage({id:"features.EventView.components.EventViewContentAnnouncement.collapse"}) : intl.formatMessage({id:"features.EventEdit.features.preview.components.PreviewTypeAnnouncement.expand"})
	}

	render() {
		const { contentData } = this.props

		return (
			<div className='type announcement'>
				<div className='title'>{contentData.title}</div>
				<div className='caption' dangerouslySetInnerHTML={{__html: contentData.body}} />
				<a className='toggle' onClick={::this.toggle}>expand</a>
			</div>
		)
	}

}

PreviewTypeAnnouncement.propTypes = {

}

export default PreviewTypeAnnouncement
