import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage, injectIntl } from 'react-intl'
import { getParticipantsUsers } from '@youversion/api-redux/lib/models'
import getTogetherModel from '@youversion/api-redux/lib/models/together'
import getPlansModel from '@youversion/api-redux/lib/models/readingPlans'
import ShareIcon from './icons/ShareIcon'
import ClickToCopy from './ClickToCopy'
import shareAction from '../widgets/ShareSheet/action'
import ShareSheet from '../widgets/ShareSheet/ShareSheet'


class ShareLink extends Component {
	handleShare = ({ url, title, text }) => {
		const { dispatch } = this.props
		dispatch(shareAction({
			url,
			title,
			text,
			isOpen: true,
		}))
	}

	render() {
		const {
		link,
		description,
		text,
		together_id,
		plans,
		together,
		participants,
		intl
	} = this.props

		const planName = plans
			&& plans.byId
			&& together
			&& together.plan_id
			&& plans.byId[together.plan_id]
			&& plans.byId[together.plan_id].name
			&& plans.byId[together.plan_id].name.default

		let shareText
		if (!text && participants && together_id) {
			shareText = intl.formatMessage(
			{ id: 'join together share' },
			{ plan: planName },
		)
		} else {
			shareText = text
		}
		const shareLink = link || (together && together.public_share)
		const linkTitle = description || <FormattedMessage id='invite others' />

		return (
			<div className='centered share-link-container white' style={{ padding: '25px' }}>
				<div className='text-center'>
					{ linkTitle }
				</div>
				<div className='vertical-center horizontal-center flex-wrap'>
					<div style={{ margin: '0 10px' }}>
						<ClickToCopy text={shareLink}>
							<div className='yv-gray-link share-link yv-text-ellipsis'>{ shareLink }</div>
						</ClickToCopy>
					</div>
					<a
						tabIndex={0}
						onClick={this.handleShare.bind(this, {
							url: shareLink,
							title: linkTitle,
							text: shareText
						})}
					>
						<ShareIcon fill='darkgray' />
					</a>
				</div>
				<div className='centered text-center' style={{ fontSize: '12px' }}>
					<FormattedMessage id='participant limit' values={{ number: 150 }} />
				</div>
				<ShareSheet />
			</div>
		)
	}
}


ShareLink.propTypes = {
	link: PropTypes.string,
	description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
	text: PropTypes.string,
	together_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	plans: PropTypes.object,
	together: PropTypes.object,
	participants: PropTypes.object,
	intl: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
}

ShareLink.defaultProps = {
	link: null,
	description: null,
	text: null,
	together_id: null,
	plans: null,
	together: null,
	participants: null,
}

function mapStateToProps(state, props) {
	const { together_id } = props
	return {
		plans: getPlansModel(state),
		participants: getParticipantsUsers(state),
		together: getTogetherModel(state) && together_id in getTogetherModel(state).byId
			? getTogetherModel(state).byId[together_id]
			: null,
		auth: state.auth,
		serverLanguageTag: state.serverLanguageTag
	}
}

export default connect(mapStateToProps, null)(injectIntl(ShareLink))
