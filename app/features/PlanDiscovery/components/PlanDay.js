import React, { PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'

import PlanDayStatus from './PlanDayStatus'
import PlanDaySlider from './PlanDaySlider'
import PlanDayStartButton from './PlanDayStartButton'
import PlanReferences from './PlanReferences'
import PlanActionButtons from './PlanActionButtons'

function PlanDay(props) {
	const {
		mode,
		plan,
		day,
		dayData,
		calendar,
		totalDays,
		aboutLink,
		subscriptionLink,
		startLink,
		bibleLink,
		isSaved,
		devoCompleted,
		hasDevo,
		handleCompleteRef,
	} = props

	const style = `
	.devotional p,
	.devotional blockquote,
	.devotional h1,
	.devotional h2,
	.devotional .video-container {
	    margin-bottom: 20px;
			font-size: 16px;
	}
	`
	return (
		<div>
			{(mode === 'sample') &&
				<div className="row">
					<div className="columns medium-8 large-8 medium-centered text-center">
						<PlanActionButtons
							id={plan.id}
							aboutLink={aboutLink}
							subscriptionLink={subscriptionLink}
							mode={mode}
							isSubscribed={'subscription_id' in plan}
							isSaved={isSaved}
						/>
					</div>
				</div>
			}
			<div className="row days-container collapse">
				<div className="columns large-8 medium-8 medium-centered">
					<PlanDaySlider
						mode={mode}
						day={day}
						calendar={calendar}
						subscriptionLink={subscriptionLink}
						aboutLink={aboutLink}
					/>
				</div>
			</div>
			<div className="row">
				<div className="columns large-8 medium-8 medium-centered">
					<div className="start-reading">
						{(mode === 'subscription') &&
							<PlanDayStartButton
								dayData={dayData}
								link={startLink}
							/>
						}
					</div>
					<PlanDayStatus
						mode={mode}
						day={day}
						calendar={calendar}
						total={totalDays}
					/>
					<PlanReferences
						mode={mode}
						day={day}
						devoCompleted={devoCompleted}
						completedRefs={dayData.references_completed}
						references={dayData.reference_content}
						link={subscriptionLink}
						bibleLink={bibleLink}
						hasDevo={hasDevo}
						handleCompleteRef={handleCompleteRef}
					/>
				</div>
			</div>
			{(mode === 'sample' && hasDevo) &&
				<div className="row devo-content">
					<style dangerouslySetInnerHTML={{ __html: style }} />
					<div className="columns large-8 medium-8 medium-centered">
						<div className="devo-header">
							<FormattedMessage id="plans.devotional" />
						</div>
						<div className="devotional" dangerouslySetInnerHTML={{ __html: dayData.additional_content.html.default || dayData.additional_content.text.default }} />
					</div>
				</div>
			}
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
	bibleLink: PropTypes.string.isRequired,
	devoCompleted: PropTypes.bool.isRequired,
	hasDevo: PropTypes.bool.isRequired,
	isSaved: PropTypes.bool.isRequired,
	handleCompleteRef: PropTypes.func.isRequired,
	plan: PropTypes.object.isRequired,
	mode: PropTypes.oneOf(['sample', 'subscription', 'about']).isRequired
}

PlanDay.defaultProps = {
	mode: 'subscription'
}

export default PlanDay
