import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage, injectIntl } from 'react-intl'
import { getParticipantsUsers } from '@youversion/api-redux/lib/models'
import getTogetherModel from '@youversion/api-redux/lib/models/together'
import getPlansModel from '@youversion/api-redux/lib/models/readingPlans'
import ShareIcon from './Icons/ShareIcon'
import ClickToCopy from './ClickToCopy'
import Share from '../features/Bible/components/verseAction/share/Share'


function ShareLink({
	link,
	description,
	text,
	together_id,
	plans,
	together,
	participants,
	intl
}) {

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
		<div className='centered share-link-container' style={{ padding: '25px 0' }}>
			<div className='text-center'>
				{ linkTitle }
			</div>
			<div className='vertical-center horizontal-center flex-wrap'>
				<div style={{ margin: '25px 10px' }}>
					<ClickToCopy text={link} customClass='yv-gray-link share-link'>
						{ shareLink }
					</ClickToCopy>
				</div>
				<a>
					<Share
						text={shareText}
						url={shareLink}
						button={
							<ShareIcon />
						}
					/>
				</a>
			</div>
		</div>
	)
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
