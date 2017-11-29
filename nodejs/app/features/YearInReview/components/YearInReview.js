import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { getUserById } from '@youversion/api-redux/lib/endpoints/users/reducer'
import { FormattedMessage } from 'react-intl'

class YearInReview extends Component {

	constructor(props) {
		super(props)
	}

	render() {
		const { user, userIdHash, locale, nodeHost } = this.props
		let imgSrc;
		let introCopy;

		if (user && ('response' in user)) {
			imgSrc = `${nodeHost}/year-in-review/${userIdHash}/${user.response.id}/500?locale=${locale}`
			introCopy = (
				<div>
					<FormattedMessage tagName="h1" id="hi name" values={{name: user.response.name}} />
					<FormattedMessage tagName="h2" id="your snapshot" />
					<div className="year-in-review-img-container">
						<img src={imgSrc} />
					</div>
					<a href="#" className="year-in-review-share-link">Share Your Snapshot</a>
				</div>
			)
		}

		return (
			<div style={{"textAlign":"center"}} className="medium-10 large-7 columns small-centered">
				{introCopy}
			</div>
		)
	}
}

YearInReview.propTypes = {
	user: PropTypes.object.isRequired,
	userIdHash: PropTypes.string.isRequired,
	nodeHost: PropTypes.string.isRequired,
	locale: PropTypes.string.isRequired
}

YearInReview.defaultProps = {

}

function mapStateToProps(state) {
	return {
		user: getUserById(state, state.userId),
		nodeHost: state.nodeHost,
		userIdHash: state.userIdHash,
		locale: state.serverLanguageTag
	}
}

export default connect(mapStateToProps, null)(YearInReview)