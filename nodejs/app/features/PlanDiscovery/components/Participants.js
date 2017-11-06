import React, { PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import Heading from '@youversion/react-components/dist/typography/Heading1'
import SectionedLayout from '@youversion/react-components/dist/layouts/SectionedLayout'
import XMark from '../../../components/XMark'
import CheckMark from '../../../components/CheckMark'
import LazyImage from '../../../components/LazyImage'
import User from '../../../components/User'
import ShareLink from '../../../components/ShareLink'
import Placeholder from '../../../components/placeholders/MediaListItemPlaceholder'
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
			<div className='large-8 small-11 centered' style={{ marginBottom: '25px' }}>
				<SectionedLayout
					left={backLink}
				>
					<Heading>
						<FormattedMessage id='participants' />
					</Heading>
				</SectionedLayout>
			</div>
			<div className='gray-background content horizontal-center flex-wrap' style={{ height: '100%' }}>
				<div style={{ width: '100%', marginBottom: '100px' }}>
					<div className='yv-large-5 yv-small-12 white centered' style={{ paddingTop: '1.07143rem', paddingBottom: '1.07143rem' }}>
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
									<div className='friend-list' style={{ marginTop: '60px' }}>
										<Placeholder
											key='friends-placeholder'
											height='38px'
											width='38px'
											borderRadius='38'
											duplicate={15}
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
