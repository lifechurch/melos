import React, { PropTypes } from 'react'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import PlanDayStatus from './PlanDayStatus'
import PlanDaySlider from './PlanDaySlider'
import PlanDayStartButton from './PlanDayStartButton'
import PlanReferences from './PlanReferences'
import PlanActionButtons from './PlanActionButtons'

function PlanDay(props) {
	const {
		plan,
		day,
		dayData,
		calendar,
		planLinkNode,
		dayBaseLink,
		totalDays,
		aboutLink,
		isSubscribed,
		actionsNode,
		refListNode,
		subscriptionLink,
		startLink,
		isSaved,
		devoCompleted,
		hasDevo,
		handleCompleteRef,
	} = props

	// parent overwrite a few things if desired
	let refsDiv, actionsDiv
	if (actionsNode) {
		actionsDiv = actionsNode
	} else {
		actionsDiv = (
			<PlanActionButtons
				id={plan.id}
				subscriptionLink={subscriptionLink}
				planLinkNode={planLinkNode}
				isSubscribed={isSubscribed}
				isSaved={isSaved}
			/>
		)
	}
	if (refListNode) {
		refsDiv = refListNode
	} else {
		refsDiv = (
			<PlanReferences
				day={day}
				devoCompleted={devoCompleted}
				completedRefs={dayData.references_completed}
				references={dayData.reference_content}
				link={subscriptionLink}
				hasDevo={hasDevo}
				handleCompleteRef={handleCompleteRef}
			/>
		)
	}

	return (
		<div>
			<div className="row">
				<div className="columns medium-8 large-8 medium-centered text-center">
					{ actionsDiv }
				</div>
			</div>
			<div className="row days-container collapse">
				<div className="columns large-8 medium-8 medium-centered">
					<PlanDaySlider
						day={day}
						calendar={calendar}
						dayBaseLink={dayBaseLink}
						showDate={isSubscribed}
					/>
				</div>
			</div>
			<div className="row">
				<div className="columns large-8 medium-8 medium-centered">
					{
								isSubscribed ?
									<div>
										<div className="start-reading">
											<PlanDayStartButton
												dayData={dayData}
												link={startLink}
											/>
										</div>
										<PlanDayStatus
											day={day}
											calendar={calendar}
											total={totalDays}
										/>
									</div> :
									<p>
										<FormattedHTMLMessage id="plans.which day in plan" values={{ day, total: plan.total_days }} />
										&nbsp;&bull;&nbsp;
										<FormattedMessage id="plans.read today" />
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
	dayData: PropTypes.object.isRequired,
	calendar: PropTypes.array.isRequired,
	totalDays: PropTypes.number.isRequired,
	subscriptionLink: PropTypes.string.isRequired,
	aboutLink: PropTypes.string.isRequired,
	startLink: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
	devoCompleted: PropTypes.bool.isRequired,
	hasDevo: PropTypes.bool.isRequired,
	isSaved: PropTypes.bool.isRequired,
	handleCompleteRef: PropTypes.func,
	plan: PropTypes.object.isRequired,
	actionsNode: PropTypes.node,
	planLinkNode: PropTypes.node,
	isSubscribed: PropTypes.bool.isRequired,
}

PlanDay.defaultProps = {
	actionsNode: null,
	handleCompleteRef: () => {},
	planLinkNode: null,

}

export default PlanDay
