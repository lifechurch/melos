import React, { PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import Heading from '@youversion/melos/dist/components/typography/Heading1'
import LazyImage from '@youversion/melos/dist/components/images/LazyImage'
import SectionedLayout from '../../../components/SectionedLayout'
import ParticipantsAvatarList from '../../../widgets/ParticipantsAvatarList'
import TogetherInvitationActions from '../../../widgets/TogetherInvitationActions'
import InvitationString from '../../../widgets/InvitationString'
import Card from '../../../components/Card'


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
	joinToken,
}) {

	return (
		<div className='invitation text-center'>
			<div className='large-8 small-11 centered' style={{ marginBottom: '25px' }}>
				<SectionedLayout>
					<Heading>
						<FormattedMessage id='invitation' />
					</Heading>
				</SectionedLayout>
			</div>
			<div className='gray-background content'>
				<div className='yv-small-11 yv-medium-6 yv-large-4 centered' style={{ padding: '60px 0 130px 0' }}>
					<Card style={{ padding: '0 0 25px 0' }}>
						<a href={planLink}>
							<LazyImage
								alt='plan-image'
								src={planImg}
								lazy={false}
								style={{ width: '100%', marginBottom: '10px' }}
							/>
							<div className='dark-gray' style={{ marginBottom: '30px', fontSize: '14px' }}>
								{ planTitle }
							</div>
						</a>
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
