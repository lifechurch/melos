import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router'
import SubscribeUserAction from './SubscribeUserAction'
import SaveForLaterAction from './SaveForLaterAction'

function PlanActionButtons({
	id,
	planLinkNode,
	subLinkBase,
	subscriptionsLink,
	isSubscribed,
	isSaved
}) {
	return (
		<div style={{ marginTop: 30, fontSize: 12 }}>
			<div className='row collapse text-center'>
				<div className='columns small-12'>
					<SubscribeUserAction
						id={id}
						subLinkBase={subLinkBase}
						style={{ display: 'inline-block' }}
					/>
				</div>
			</div>
			<div className='row collapse text-center'>
				<div className='columns small-12'>
					{
						isSubscribed
							? (
								<div className='horizontal-center flex-wrap'>
									<div style={{ width: '100%' }}>
										<FormattedMessage id='currently subscribed' />
									</div>
									<Link to={subscriptionsLink}>
										<FormattedMessage id='plans.my plans' />
									</Link>
								</div>
							)
							: (
								<div className='horizontal-center vertical-center'>
									<SaveForLaterAction
										id={id}
										isSaved={isSaved}
									/>
									&nbsp;&bull;&nbsp;
									{ planLinkNode }
								</div>
							)
					}
				</div>
			</div>
		</div>
	)
}

PlanActionButtons.propTypes = {
	id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	planLinkNode: PropTypes.node.isRequired,
	subLinkBase: PropTypes.string.isRequired,
	isSubscribed: PropTypes.bool.isRequired,
	isSaved: PropTypes.bool.isRequired,
	subscriptionsLink: PropTypes.string,
}

PlanActionButtons.defaultProps = {
	subscriptionsLink: null,
}

export default PlanActionButtons
