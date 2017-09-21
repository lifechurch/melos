import React, { Component } from 'react'
import rtlDetect from 'rtl-detect'
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
				HELLLOOOOOO
				<NotificationsList />
			</div>
		)
	}
}

export default NotificationsView
