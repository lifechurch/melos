import React, { PropTypes } from 'react'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import ParticipantsAvatarList from '../../../widgets/ParticipantsAvatarList'
import PlanDayStatus from './PlanDayStatus'
import PlanDaySlider from './PlanDaySlider'
import PlanDayStartButton from './PlanDayStartButton'
import PlanContentListItem from './PlanContentListItem'
import PlanActionButtons from './PlanActionButtons'


function PlanDay(props) {
	const {
		id,
		plan,
		day,
		start_dt,
		daySegments,
		progressDays,
		references,
		planLinkNode,
		dayBaseLink,
		totalDays,
		aboutLink,
		isSubscribed,
		actionsNode,
		refListNode,
		language_tag,
		isRtl,
		subscriptionLink,
		startLink,
		isSaved,
		devoCompleted,
		hasDevo,
		handleCompleteRef,
		together_id
	} = props

	let refsDiv = null
	const dayProgress = progressDays && progressDays[day - 1] ?
											progressDays[day - 1] :
											null
	// show no content message if there is no content
	if (!dayProgress || dayProgress.complete === null) {
		refsDiv = <FormattedMessage id='plans.no content' />
	} else if (refListNode) {
		refsDiv = refListNode
	} else {
		refsDiv = (
			<ul className='no-bullets plan-pieces'>
				{
					daySegments &&
					daySegments.map((segment, i) => {
						let title
						const key = segment.kind
						const link = `${dayBaseLink}/content/${i}`
						const complete = dayProgress &&
															(dayProgress.complete ||
															(dayProgress.partial && dayProgress.partial[i]))

						if (segment.kind === 'devotional') {
							title = <FormattedMessage id='plans.devotional' />
						} else if (segment.kind === 'reference') {
							// const usfm = segment.content
							// const reference = references[usfm]
							// title = reference.verses.reference.human
							// key = usfm
						} else if (segment.kind === 'talk-it-over') {
							title = <FormattedMessage id='plans.talk it over' />
						}

						return (
							<PlanContentListItem
								key={key}
								title={title}
								isComplete={complete}
								handleIconClick={null}
								link={link}
							/>
						)
					})
				}
			</ul>
		)
	}

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
							<ParticipantsAvatarList together_id={together_id} avatarWidth={46} />
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
									<div>This progress status is going to be pulled from the new progress api call</div>
								</div> :
								<p>
									<FormattedHTMLMessage id='plans.which day in plan' values={{ day, total: totalDays }} />
									&nbsp;&bull;&nbsp;
									<FormattedMessage id='plans.read today' />
								</p>
						}
					{ refsDiv }
				</div>
			</div>
		</div>
	)
}

PlanDay.propTypes = {
	day: PropTypes.number.isRequired,
	totalDays: PropTypes.number.isRequired,
	subscriptionLink: PropTypes.string.isRequired,
	aboutLink: PropTypes.string.isRequired,
	startLink: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
	devoCompleted: PropTypes.bool.isRequired,
	hasDevo: PropTypes.bool.isRequired,
	isSaved: PropTypes.bool.isRequired,
	isRtl: PropTypes.func,
	handleCompleteRef: PropTypes.func,
	id: PropTypes.number.isRequired,
	actionsNode: PropTypes.node,
	planLinkNode: PropTypes.node,
	isSubscribed: PropTypes.bool.isRequired,
}

PlanDay.defaultProps = {
	actionsNode: null,
	handleCompleteRef: () => {},
	isRtl: () => { return false },
	planLinkNode: null,
}

export default PlanDay
