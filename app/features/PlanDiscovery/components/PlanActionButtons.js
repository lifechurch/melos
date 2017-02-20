import React, { PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router'

import SubscribeUserAction from './SubscribeUserAction'
import SaveForLaterAction from './SaveForLaterAction'

function PlanActionButtons({ id, mode, aboutLink, subscriptionLink, isSubscribed, isSaved }) {
	return (
		<div style={{ marginTop: 30, fontSize: 12 }}>
			<SubscribeUserAction
				id={id}
				isSubscribed={isSubscribed}
				subscriptionLink={subscriptionLink}
				style={{ display: 'inline-block' }}
			/>
			<div className='text-center'>
				<SaveForLaterAction
					id={id}
					isSaved={isSaved}
				/>
				&nbsp;&bull;&nbsp;
				{(mode === 'sample') &&
					<Link to={`${aboutLink}`}><FormattedMessage id="plans.about this plan" /></Link>
				}
				{(mode === 'about') &&
					<Link to={`${aboutLink}/day/1`}><FormattedMessage id="plans.sample" /></Link>
				}
			</div>
		</div>
	)
}

PlanActionButtons.propTypes = {
	id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	aboutLink: PropTypes.string.isRequired,
	subscriptionLink: PropTypes.string.isRequired,
	mode: PropTypes.oneOf(['sample', 'subscription', 'about']).isRequired,
	isSubscribed: PropTypes.bool.isRequired,
	isSaved: PropTypes.bool.isRequired,
}

export default PlanActionButtons
