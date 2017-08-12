import React, { PropTypes } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'
import XMark from '../../../components/XMark'
import CheckMark from '../../../components/CheckMark'
import LazyImage from '../../../components/LazyImage'
import User from '../../../components/User'
import ShareLink from '../../../components/ShareLink'
import { PLAN_DEFAULT } from '../../../lib/imageUtil'
import Routes from '../../../lib/routes'
import { hasUserCompletedActivity } from '../../../lib/readingPlanUtils'


function renderUser(friend, handleDelete = null, complete = null) {
	const src = friend && friend.user_avatar_url ? friend.user_avatar_url.px_48x48 : ''
	const userLink = Routes.user({
		username: friend && friend.username,
	})
	return (
		<div className='vertical-center item' key={friend.id}>
			<User
				avatarLetter={friend.first_name ? friend.first_name.charAt(0) : null}
				src={src}
				width={36}
				heading={friend.name ? friend.name : null}
				subheading={friend.source ? friend.source : null}
				link={userLink}
			/>
			{
				complete &&
				<CheckMark fill='black' />
			}
			{
				handleDelete &&
				<a tabIndex={0} onClick={handleDelete.bind(this, friend.id)}>
					<XMark width={13} height={13} />
				</a>
			}
		</div>
	)
}

function Participants({ planImg, users, shareLink, handleDelete, backLink, activities, intl }) {
	const accepted = []
	const invited = []
	// build accepted and not accepted lists
	users.forEach((user) => {
		if (user.status === 'accepted' || user.status === 'host') accepted.push(user)
		if (user.status === 'invited') invited.push(user)
	})

	return (
		<div className='pwf-flow pwf-invite'>
			<div className='reading_plan_index_header medium-8 small-11 centered vertical-center'>
				{ backLink }
				<div className='text-center' style={{ fontSize: '18px', flex: 1 }}>
					<FormattedMessage id='participants' />
				</div>
				<a
					tabIndex={0}
					className='yv-gray-link'
					onClick={
						() => {
							document.getElementById('share-link').scrollIntoView(false)
						}
					}
				>
					<FormattedMessage id='invite others' />
				</a>
			</div>
			<div className='gray-background content'>
				<div className='columns medium-5 small-12 small-centered white' style={{ paddingTop: '1.07143rem', paddingBottom: '1.07143rem' }}>
					<div className='horizontal-center' style={{ height: '250px', marginBottom: '30px' }}>
						<LazyImage
							alt='plan-image'
							src={planImg}
							width={400}
							height={250}
							placeholder={<img alt='plan' src={PLAN_DEFAULT} />}
						/>
					</div>
					<div className='users'>
						{
							!users
								? (
									<div className='friend-list'>
										<FormattedMessage id='loading' />
									</div>
								)
								: (
									<div>
										<div className='friend-list' style={{ marginBottom: '30px' }}>
											{
											accepted.length > 0 &&
											<div className='gray-heading'>
												<FormattedMessage id='accepted' />
												{` (${accepted.length}) `}
											</div>
										}
											{
											accepted.map((user) => {
												return renderUser(
													user,
													handleDelete,
													hasUserCompletedActivity(activities, user.id)
												)
											})
										}
										</div>
										<div className='friend-list'>
											{
											invited.length > 0 &&
											<div className='gray-heading'>
												<FormattedMessage id='pending' />
												{` (${invited.length}) `}
											</div>
										}
											{
											invited.map((user) => {
												return renderUser(user, handleDelete)
											})
										}
										</div>
									</div>
								)
						}
					</div>
				</div>
			</div>
			<div id='share-link'>
				<ShareLink
					link={shareLink}
					text={intl.formatMessage({ id: 'join together' })}
					description={<FormattedMessage id='use share link' />}
				/>
			</div>
		</div>
	)
}

Participants.propTypes = {
	planImg: PropTypes.string,
	activities: PropTypes.object,
	shareLink: PropTypes.string,
	backLink: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
	users: PropTypes.array,
	handleDelete: PropTypes.func,
}

export default injectIntl(Participants)
