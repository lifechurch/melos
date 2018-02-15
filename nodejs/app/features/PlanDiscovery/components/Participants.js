import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import Heading from '@youversion/melos/dist/components/typography/Heading1'
import SectionedLayout from '@youversion/melos/dist/components/layouts/SectionedLayout'
import hasUserCompletedActivity from '@youversion/utils/lib/readingPlans/hasUserCompletedActivity'
import LazyImage from '@youversion/melos/dist/components/images/LazyImage'
import Routes from '@youversion/utils/lib/routes/routes'
import XMark from '../../../components/XMark'
import CheckMark from '../../../components/CheckMark'
import User from '../../../components/User'
import ShareLink from '../../../components/ShareLink'
import Placeholder from '../../../components/placeholders/MediaListItemPlaceholder'


function renderUser(friend, handleDelete = null, complete = null) {
	const src = friend && friend.user_avatar_url ? friend.user_avatar_url.px_48x48 : ''
	const userLink = Routes.user({
		username: friend && friend.username,
	})
	return (
		<div className='vertical-center item' key={friend.id}>
			<div style={{ width: 'initial' }}>
				<User
					avatarLetter={friend.first_name ? friend.first_name.charAt(0) : null}
					src={src}
					width={36}
					heading={friend.name ? friend.name : null}
					subheading={friend.source ? friend.source : null}
					link={userLink}
				/>
			</div>
			{
				friend.status === 'host'
					&& (
						<div className='font-badge' style={{ fontSize: '15px' }}>
							<FormattedMessage id='host' />
						</div>
					)
			}
			<div className='margin-left-auto vertical-center'>
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
			<div className='yv-large-8 yv-small-11 centered' style={{ marginBottom: '25px' }}>
				<SectionedLayout left={backLink}>
					<Heading>
						<FormattedMessage id='participants' />
					</Heading>
				</SectionedLayout>
			</div>
			<div className='gray-background content horizontal-center flex-wrap' style={{ height: '100%' }}>
				<div style={{ width: '100%', marginBottom: '100px' }}>
					<div className='yv-large-4 yv-medium-6 yv-small-11 white centered'>
						{
							planImg
								&& (
									<LazyImage
										alt='Devotional'
										style={{ width: '100%' }}
										src={planImg}
									/>
								)
						}
						{
							day
								&& (
									<div className='text-center' style={{ width: '100%', margin: '10px 0' }}>
										<FormattedMessage id='plans.day number' values={{ day }} />
									</div>
								)
						}
						<div className='users' style={{ padding: '25px 0 15px 0' }}>
							{
								!(accepted || pending)
								? (
									<div className='friend-list'>
										<Placeholder
											key='friends-placeholder'
											height='38px'
											width='38px'
											borderRadius='38'
											duplicate={6}
											lineSpacing='16px'
											textHeight='10px'
											widthRange={[30, 60]}
											style={{ margin: '20px 20px' }}
										/>
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
						{ together_id && handleDelete && <ShareLink together_id={together_id} /> }
					</div>
				</div>
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
