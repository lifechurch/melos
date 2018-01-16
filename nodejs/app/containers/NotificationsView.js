import React, { Component, PropTypes } from 'react'
import rtlDetect from 'rtl-detect'
import { FormattedMessage } from 'react-intl'
import Settings from '../components/icons/Settings'
import IconButton from '../components/IconButton'
import SectionedLayout from '../components/SectionedLayout'
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
					<SectionedLayout
						style={{ height: '60px', padding: '15px' }}
						right={
							<IconButton
								to='/notifications/edit'
								useClientRouting={false}
								iconHeight={25}
							>
								<Settings />
							</IconButton>
						}
					>
						<h1 style={{ fontWeight: 'normal' }}>
							<FormattedMessage id='notifications' />
						</h1>
					</SectionedLayout>
				</div>
				<div
					className='gray-background'
					style={{ padding: '50px 0', minHeight: '400px' }}
				>
					<NotificationsList
						className='large-5 small-11 centered'
						avatarWidth={38}
					/>
				</div>
			</div>
		)
	}
}

NotificationsView.propTypes = {
	params: PropTypes.object.isRequired,
	serverLanguageTag: PropTypes.string.isRequired,
}

export default NotificationsView
