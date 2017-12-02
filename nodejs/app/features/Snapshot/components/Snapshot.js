import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { getUserById } from '@youversion/api-redux/lib/endpoints/users/reducer'
import { FormattedMessage } from 'react-intl'
import Button from '../../../components/Button'
import ButtonGroup from '../../../components/ButtonGroup'
import { localizedLink } from '../../../lib/routeUtils'
import Share from './Share'

class Snapshot extends Component {

	constructor(props) {
		super(props)
	}

	renderGeneric() {
		const { locale, nodeHost } = this.props
		const imgSrc = `${nodeHost}/snapshot/default/500?locale=${locale}`
		return(
			<div>
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
		const { user, userIdHash, locale, nodeHost, viewingMine } = this.props
		const imgSrc = `${nodeHost}/snapshot/${userIdHash}/${user.response.id}/500?locale=${locale}&year=2017`
		let bottomLinks
		let topCopy

		if (viewingMine) {
			bottomLinks = (
				<ul>
					<li>
						<a>
							<FormattedMessage id="share" />
						</a>
					</li>
				</ul>
				
			)
			topCopy = (
				<div className="snapshot-top-copy">
					<FormattedMessage tagName="h1" id="hi name" values={{name: user.response.name}} />
					<FormattedMessage tagName="p" id="your snapshot" />
				</div>
			)

		} else {
			topCopy = (
				<div className="snapshot-top-copy">
					<FormattedMessage tagName="h1" id="user snapshot" values={{year: "2017", name: user.response.first_name}} />
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
						<a target="_self" href={localizedLink("/snapshot",locale)}>
							View My Snapshot
						</a>
					</li>
				</ul>
			)
		}


		return(
			<div>
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
		let content

		content = (user && ('response' in user)) ? this.renderDetail() : this.renderGeneric()

		return (
			<div className="snapshot-wrapper medium-10 large-7 columns small-centered">
				{content}
			</div>
		)
	}
}

Snapshot.propTypes = {
	user: PropTypes.object,
	userIdHash: PropTypes.string,
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

export default connect(mapStateToProps, null)(Snapshot)