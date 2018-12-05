import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { getUserById } from '@youversion/api-redux/lib/endpoints/users/reducer'
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl'
import localizedLink from '@youversion/utils/lib/routes/localizedLink'
import ShareSheet from '../../../widgets/ShareSheet/ShareSheet'
import shareAction from '../../../widgets/ShareSheet/action'
import Snapshot500 from '../../../../images/Snapshot500.jpg'
import Snapshot1000 from '../../../../images/Snapshot1000.jpg'

class Snapshot extends Component {
	handleShare = () => {
		const { dispatch, intl } = this.props;
		dispatch(shareAction({
			isOpen: true,
			text: intl.formatMessage({ id: 'my year' }),
			url: document.location.href
		}))
	}

	renderGeneric() {
		const { locale, nodeHost, railsHost, intl } = this.props
		const imgSrc = `${nodeHost}${Snapshot500}`
		const imgSrc2x = `${nodeHost}${Snapshot1000}`
		const snapshotUrl = `${railsHost}/snapshot`

		return (
			<div>
				<Helmet
					title={intl.formatMessage({ id: 'my year' })}
					meta={[
            { property: 'og:image', content: `https:${imgSrc2x}` },
            { property: 'og:image:height', content: '1000' },
            { property: 'og:image:width', content: '1000' },
            { property: 'og:url', content: `${snapshotUrl}` },
            { property: 'og:type', content: 'website' },
            { property: 'fb:app_id', content: '105030176203924' },
            { property: 'og:title', content: intl.formatMessage({ id: 'my year' }) },
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:site', content: '@youversion' },
            { name: 'twitter:creator', content: '@youversion' },
						{ name: 'twitter:image', content: `https:${imgSrc2x}` }
					]}
    />
				<div className="snapshot-img-container">
					<img alt='snapshot' src={imgSrc} srcSet={`${imgSrc} 1x, ${imgSrc2x} 2x`} />
				</div>
				<div className="snapshot-bottom-copy">
					<FormattedMessage tagName="h2" id="view snapshot" />
					<ul>
						<li>
							<a href={localizedLink('/sign-in?redirect=/snapshot')}>
								<FormattedHTMLMessage id="header.sign in" />
							</a>
						</li>
						<li>
							<a href={localizedLink('/sign-up')}>
								<FormattedHTMLMessage id="header.sign up" />
							</a>
						</li>
					</ul>
				</div>
			</div>
		)
	}

	renderDetail() {
		const { user, userIdHash, locale, nodeHost, railsHost, viewingMine, year, intl } = this.props
		const imgSrc = `${nodeHost}/snapshot/${userIdHash}/${user.response.id}/500?locale=${locale}&year=${year}`
		const imgSrc2x = `${nodeHost}/snapshot/${userIdHash}/${user.response.id}/1000?locale=${locale}&year=${year}`
		const snapshotUrl = `${railsHost}/snapshot/${userIdHash}/${user.response.id}?year=${year}`
		let bottomLinks
		let topCopy

		if (viewingMine) {
			bottomLinks = (
				<ul>
					<li>
						<a tabIndex={0} onClick={this.handleShare}>
							<FormattedMessage id="share" />
						</a>
					</li>
				</ul>
			)
			topCopy = (
				<div className="snapshot-top-copy">
					<FormattedMessage tagName="h1" id="hi name" values={{ name: user.response.name }} />
					<FormattedMessage tagName="p" id="your snapshot" />
				</div>
			)

		} else {
			topCopy = (
				<div className="snapshot-top-copy">
					<FormattedMessage tagName="h1" id="user snapshot" values={{ year: year, user: user.response.first_name }} />
				</div>
			)

			bottomLinks = (
				<ul>
					<li>
						<a target="_self" href="http://bible.com/app">
							<FormattedMessage id="download the bible" />
						</a>
					</li>
					<li>
						<a target="_self" href={localizedLink('/snapshot', locale)}>
							<FormattedMessage id="view my snapshot" />
						</a>
					</li>
				</ul>
			)
		}


		return (
			<div>
				<Helmet
					title={intl.formatMessage({ id: 'user snapshot' }, { year: year, user: user.response.first_name })}
					meta={[
            { property: 'og:image', content: `https:${imgSrc2x}` },
            { property: 'og:url', content: `${snapshotUrl}` },
            { property: 'og:type', content: 'website' },
            { property: 'fb:app_id', content: '105030176203924' },
            { property: 'og:image:height', content: '1000' },
            { property: 'og:image:width', content: '1000' },
            { property: 'og:title', content: intl.formatMessage({ id: 'user snapshot' }, { year: year, user: user.response.first_name }) },
            { property: 'og:description', content: intl.formatMessage({ id: 'your snapshot' }) },
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:site', content: '@youversion' },
            { name: 'twitter:creator', content: '@youversion' },
						{ name: 'twitter:image', content: `https:${imgSrc2x}` }
					]}
    />

				{topCopy}
				<div className="snapshot-img-container">
					<img alt='snapshot' src={imgSrc} srcSet={`${imgSrc} 1x, ${imgSrc2x} 2x`} />
				</div>
				<div className="snapshot-bottom-copy">
					{bottomLinks}
				</div>
			</div>
		)
	}

	render() {
		const { user } = this.props
		const content = (user && ('response' in user)) ? this.renderDetail() : this.renderGeneric()

		return (
			<div className="snapshot-wrapper medium-10 large-7 columns small-centered">
				{content}
				<ShareSheet />
			</div>
		)
	}
}

Snapshot.propTypes = {
	user: PropTypes.object,
	userIdHash: PropTypes.string,
	intl: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
	nodeHost: PropTypes.string.isRequired,
	railsHost: PropTypes.string.isRequired,
	locale: PropTypes.string.isRequired,
	viewingMine: PropTypes.bool.isRequired,
	year: PropTypes.number.isRequired
}

Snapshot.defaultProps = {
	user: null,
	userIdHash: null
}

function mapStateToProps(state) {
	return {
		user: getUserById(state, state.userId),
		nodeHost: state.nodeHost,
		railsHost: state.hosts.railsHost,
		userIdHash: state.userIdHash,
		locale: state.serverLanguageTag,
		viewingMine: state.viewingMine,
		year: state.year,
	}
}

export default connect(mapStateToProps, null)(injectIntl(Snapshot))
