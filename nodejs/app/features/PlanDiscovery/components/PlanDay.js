import React, { PropTypes } from 'react'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import ParticipantsAvatarList from '../../../widgets/ParticipantsAvatarList'
import PlanDaySlider from './PlanDaySlider'
import PlanDayStartButton from './PlanDayStartButton'
import PlanActionButtons from './PlanActionButtons'


function PlanDay(props) {
	const {
		id,
		day,
		start_dt,
		progressDays,
		progressString,
		planLinkNode,
		totalDays,
		isSubscribed,
		isCompleted,
		actionsNode,
		refListNode,
		language_tag,
		isRtl,
		subscriptionLink,
		startLink,
		isSaved,
		together_id
	} = props


	return (
		<div>
			<div className='row'>
				<div className='columns medium-8 large-8 medium-centered text-center'>
					{
						actionsNode ||
						<PlanActionButtons
							id={id}
							subscriptionLink={subscriptionLink}
							planLinkNode={planLinkNode}
							isSubscribed={isSubscribed}
							isSaved={isSaved}
						/>
					}
				</div>
			</div>
			<div className='row days-container collapse'>
				<div className='columns large-8 medium-8 medium-centered'>
					{
						totalDays &&
						<PlanDaySlider
							day={day}
							totalDays={totalDays}
							progressDays={progressDays}
							isCompleted={isCompleted}
							start_dt={start_dt}
							dayBaseLink={subscriptionLink}
							showDate={isSubscribed}
							language_tag={language_tag}
							isRtl={isRtl()}
						/>
					}
				</div>
			</div>
			<div className='row'>
				<div className='columns large-8 medium-8 medium-centered'>
					{
						together_id &&
						<div style={{ marginBottom: '25px' }}>
							<ParticipantsAvatarList
								together_id={together_id}
								day={day}
								statusFilter={['accepted', 'host']}
								avatarWidth={36}
							/>
						</div>
					}
					{
							isSubscribed ?
								<div>
									<div className='start-reading'>
										<PlanDayStartButton
											link={startLink}
										/>
									</div>
									<p>
										<FormattedHTMLMessage id='plans.which day in plan' values={{ day, total: totalDays }} />
										&nbsp;&bull;&nbsp;
										{ progressString }
									</p>
								</div> :
								<p>
									<FormattedHTMLMessage id='plans.which day in plan' values={{ day, total: totalDays }} />
									&nbsp;&bull;&nbsp;
									<FormattedMessage id='plans.read today' />
								</p>
					}
					{
						refListNode ||
						<FormattedMessage id='plans.no content' />
					}
				</div>
			</div>
		</div>
	)
}

PlanDay.propTypes = {
	day: PropTypes.number.isRequired,
	together_id: PropTypes.number,
	totalDays: PropTypes.number.isRequired,
	progressDays: PropTypes.array,
	progressString: PropTypes.node,
	subscriptionLink: PropTypes.string.isRequired,
	start_dt: PropTypes.string,
	startLink: PropTypes.string.isRequired,
	isSaved: PropTypes.bool.isRequired,
	isRtl: PropTypes.func,
	language_tag: PropTypes.string.isRequired,
	id: PropTypes.number.isRequired,
	actionsNode: PropTypes.node,
	refListNode: PropTypes.node,
	planLinkNode: PropTypes.node,
	isSubscribed: PropTypes.bool.isRequired,
}

PlanDay.defaultProps = {
	actionsNode: null,
	progressDays: null,
	together_id: null,
	start_dt: null,
	isRtl: () => { return false },
	planLinkNode: null,
	refListNode: null,
	progressString: null,
}

export default PlanDay
