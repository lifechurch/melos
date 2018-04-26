import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Row from '../../../components/Row'
import Column from '../../../components/Column'
import { FormattedMessage } from 'react-intl'

class EventViewContentAnnouncement extends Component {

	toggle(e) {
		const { intl } = this.props
		const content = e.currentTarget.childNodes
		content[1].text = content[1].text == intl.formatMessage({ id: 'features.EventEdit.features.preview.components.PreviewTypeAnnouncement.expand' }) ? intl.formatMessage({ id: 'features.EventView.components.EventViewContentAnnouncement.collapse' }) : intl.formatMessage({ id: 'features.EventEdit.features.preview.components.PreviewTypeAnnouncement.expand' })
		content[2].classList.toggle('show')
	}

	render() {
		const { contentData } = this.props

		return (
			<div className='content announcement' onClick={::this.toggle}>
				<div className='title left'>{contentData.title}</div>
				<a className='toggle right'><FormattedMessage id="features.EventView.components.EventViewDetails.expand" /></a>
				<div className='caption' dangerouslySetInnerHTML={{ __html: contentData.body }} />
			</div>
		)
	}

}

EventViewContentAnnouncement.propTypes = {

}

export default EventViewContentAnnouncement
