import React, { PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import XMark from '../../../components/XMark'
import CheckMark from '../../../components/CheckMark'
import LazyImage from '../../../components/LazyImage'
import User from '../../../components/User'
import ShareLink from '../../../components/ShareLink'
import SectionedHeading from '../../../components/SectionedHeading'
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
				<a
					tabIndex={0}
					onClick={handleDelete.bind(this, friend.id)}
					style={{ marginLeft: '10px' }}
				>
					<XMark width={13} height={13} />
				</a>
			}
		</div>
	)
}

function Participants({
	planImg,
	accepted,
	pending,
	together_id,
	handleDelete,
	backLink,
	activities,
	day
}) {

	return (
		<div className='pwf-flow pwf-invite'>
			<SectionedHeading
				left={backLink}
				right={
					// handleDelete is only passed if auth is host
					handleDelete &&
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
				}
			>
				<FormattedMessage id='participants' />
			</SectionedHeading>
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
					{
						day &&
						<div className='text-center' style={{ width: '100%', margin: '10px 0' }}>
							<FormattedMessage id='plans.day number' values={{ day }} />
						</div>
					}
					<div className='users'>
						{
							!(accepted || pending)
								? (
									<div className='friend-list'>
										<FormattedMessage id='loading' />
									</div>
								)
								: (
									<div>
										<div className='friend-list' style={{ marginBottom: '30px' }}>
											{
												accepted && accepted.length > 0 &&
												<div className='gray-heading'>
													<FormattedMessage id='accepted' />
													{` (${accepted.length}) `}
												</div>
											}
											{
												accepted && accepted.length > 0 &&
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
												pending && pending.length > 0 &&
												<div className='gray-heading'>
													<FormattedMessage id='pending' />
													{` (${pending.length}) `}
												</div>
											}
											{
												pending && pending.length > 0 &&
												pending.map((user) => {
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
				{/* handleDelete is passed if auth is host, and we only show share if
					auth is host */}
				{ together_id && handleDelete && <ShareLink together_id={together_id} /> }
			</div>
		</div>
	)
}

Participants.propTypes = {
	planImg: PropTypes.string,
	activities: PropTypes.object,
	backLink: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
	day: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	together_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	accepted: PropTypes.array,
	pending: PropTypes.array,
	handleDelete: PropTypes.func,
}

export default Participants
