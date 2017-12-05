import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { getUserById } from '@youversion/api-redux/lib/endpoints/users/reducer'
import { FormattedMessage, injectIntl } from 'react-intl'
import { localizedLink } from '../../../lib/routeUtils'
import ShareSheet from '../../../widgets/ShareSheet/ShareSheet'
import shareAction from '../../../widgets/ShareSheet/action'

class Snapshot extends Component {

	constructor(props) {
		super(props)
	}

	handleShare = () => {
		const { dispatch, intl } = this.props;
		dispatch(shareAction({
			isOpen: true,
			text: intl.formatMessage({ id: 'view my snapshot' }),
			url: document.location.href
		}))
	}

	renderGeneric() {
		const { locale, nodeHost, intl } = this.props
		const imgSrc = `${nodeHost}/snapshot/default/500?locale=${locale}`
		return (
			<div>
				<Helmet title={intl.formatMessage({ id: 'my year' })} />

				<div className="snapshot-img-container">
					<img src={imgSrc} />
				</div>
				<div className="snapshot-bottom-copy">
					<FormattedMessage tagName="h2" id="view snapshot" />
					<ul>
						<li>
							<a href={localizedLink('/sign-in?redirect=/snapshot')}>
								<FormattedMessage id="header.sign in" />
							</a>
						</li>
						<li>
							<a href={localizedLink('/sign-up')}>
								<FormattedMessage id="header.sign up" />
							</a>
						</li>
					</ul>
				</div>
			</div>
		)
	}

	renderDetail() {
		const { user, userIdHash, locale, nodeHost, viewingMine, intl } = this.props
		const imgSrc = `${nodeHost}/snapshot/${userIdHash}/${user.response.id}/500?locale=${locale}&year=2017`
		let bottomLinks
		let topCopy

		if (viewingMine) {
			bottomLinks = (
				<ul>
					<li>
						<a onClick={this.handleShare}>
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
					<FormattedMessage tagName="h1" id="user snapshot" values={{ year: '2017', user: user.response.first_name }} />
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
				<Helmet title={intl.formatMessage({ id: 'user snapshot' }, { year: '2017', user: user.response.first_name })} />

				{topCopy}
				<div className="snapshot-img-container">
					<img src={imgSrc} />
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
	locale: PropTypes.string.isRequired,
	viewingMine: PropTypes.bool.isRequired
}

Snapshot.defaultProps = {
	user: null,
	userIdHash: null
}

function mapStateToProps(state) {
	return {
		user: getUserById(state, state.userId),
		nodeHost: state.nodeHost,
		userIdHash: state.userIdHash,
		locale: state.serverLanguageTag,
		viewingMine: state.viewingMine
	}
}

export default connect(mapStateToProps, null)(injectIntl(Snapshot))