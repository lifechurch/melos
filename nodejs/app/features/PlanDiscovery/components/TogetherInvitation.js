import React, { PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import ParticipantsAvatarList from '../../../widgets/ParticipantsAvatarList'
import TogetherInvitationActions from '../../../widgets/TogetherInvitationActions'
import InvitationString from '../../../widgets/InvitationString'
import Card from '../../../components/Card'
import SectionedHeading from '../../../components/SectionedHeading'
import LazyImage from '../../../components/LazyImage'
import { PLAN_DEFAULT } from '../../../lib/imageUtil'


function Invitation({
	planImg,
	planTitle,
	planLink,
	participantsString,
	startDate,
	together_id,
	showDecline,
	handleActionComplete,
	handleUnauthed,
	joinToken
}) {

	return (
		<div className='invitation text-center'>
			<SectionedHeading>
				<FormattedMessage id='invite friends' />
			</SectionedHeading>
			<div className='gray-background content'>
				<div className='columns medium-5 small-12 small-centered' style={{ padding: '40px 0 100px 0' }}>
					<Card>
						<ParticipantsAvatarList
							customClass='horizontal-center'
							avatarWidth={46}
							together_id={together_id}
							showMoreLink={false}
							statusFilter='host'
						/>
						<div style={{ margin: '20px 0' }}>
							<InvitationString together_id={together_id} />
						</div>
						<a href={planLink}>
							<div className='horizontal-center' style={{ height: '150px', marginBottom: '10px' }}>
								<LazyImage
									alt='plan-image'
									src={planImg}
									width={250}
									height={150}
									placeholder={<img alt='plan' src={PLAN_DEFAULT} />}
								/>
							</div>
							<div className='dark-gray' style={{ marginBottom: '30px', fontSize: '14px' }}>
								{ planTitle }
							</div>
						</a>
						<div style={{ marginTop: '40px' }}>
							<div className='font-grey' style={{ fontSize: '14px', marginBottom: '10px' }}>
								{ participantsString }
							</div>
							<ParticipantsAvatarList
								customClass='horizontal-center'
								together_id={together_id}
								joinToken={joinToken}
								avatarWidth={32}
							/>
						</div>
						<div style={{ margin: '50px 0 20px 0' }}>
							<div className='font-grey' style={{ fontSize: '14px' }}><FormattedMessage id='start date' /></div>
							<div style={{ fontSize: '14px' }}>{ startDate }</div>
						</div>
					</Card>
					<div className='card-buttons'>
						<TogetherInvitationActions
							customClass='stacked'
							showDecline={showDecline}
							handleActionComplete={handleActionComplete}
							handleUnauthed={handleUnauthed}
							joinToken={joinToken}
							together_id={together_id}
						/>
						<a className='card-button'><FormattedMessage id='what is this' /></a>
					</div>
				</div>
			</div>
		</div>
	)
}

Invitation.propTypes = {
	planImg: PropTypes.string.isRequired,
	planTitle: PropTypes.node.isRequired,
	participantsString: PropTypes.node.isRequired,
	startDate: PropTypes.node.isRequired,
	together_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
	planLink: PropTypes.string.isRequired,
	showDecline: PropTypes.bool,
	joinToken: PropTypes.string,
	handleActionComplete: PropTypes.func,
	handleUnauthed: PropTypes.func,
}

Invitation.defaultProps = {
	showDecline: true,
	joinToken: null,
	handleActionComplete: null,
	handleUnauthed: null
}

export default Invitation
