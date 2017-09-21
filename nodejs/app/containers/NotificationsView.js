import React, { Component } from 'react'
import rtlDetect from 'rtl-detect'
import { FormattedMessage } from 'react-intl'
import SectionedHeading from '../components/SectionedHeading'
import NotificationsList from '../features/Notifications/components/NotificationsList'

class NotificationsView extends Component {
	localizedLink(link) {
		const { params, serverLanguageTag } = this.props
		const languageTag = serverLanguageTag || params.lang || 'en'

		if (['en', 'en-US'].indexOf(languageTag) > -1) {
			return link
		} else {
			return `/${languageTag}${link}`
		}
	}

	isRtl() {
		const { params, serverLanguageTag } = this.props
		const languageTag = params.lang || serverLanguageTag || 'en'
		return rtlDetect.isRtlLang(languageTag)
	}

	render() {
		return (
			<div>
				<div className='large-5 small-11 centered'>
					<SectionedHeading>
						<h1><FormattedMessage id='notifications' /></h1>
					</SectionedHeading>
				</div>
				<div className='gray-background'>
					<NotificationsList className='large-5 small-11 centered' />
				</div>
			</div>
		)
	}
}

export default NotificationsView
