import React, { PropTypes } from 'react'

import PlanDayStatus from './PlanDayStatus'
import PlanDaySlider from './PlanDaySlider'
import PlanDayStartButton from './PlanDayStartButton'
import PlanReferences from './PlanReferences'

function PlanDay(props) {
	const { day, dayData, calendar, totalDays, subscriptionLink, startLink, devoCompleted, hasDevo, handleCompleteRef } = props
	return (
		<div>
			<div className="row days-container collapse">
				<div className="columns large-8 medium-8 medium-centered">
					<PlanDaySlider day={day} calendar={calendar} link={subscriptionLink} />
				</div>
			</div>
			<div className="row">
				<div className="columns large-8 medium-8 medium-centered">
					<div className="start-reading">
						<PlanDayStartButton dayData={dayData} link={startLink} />
					</div>
					<PlanDayStatus day={day} calendar={calendar} total={totalDays} />
					<PlanReferences
						day={day}
						devoCompleted={devoCompleted}
						completedRefs={dayData.references_completed}
						references={dayData.reference_content}
						link={subscriptionLink}
						hasDevo={hasDevo}
						handleCompleteRef={handleCompleteRef}
					/>
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
	startLink: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
	devoCompleted: PropTypes.bool,
	hasDevo: PropTypes.bool,
	handleCompleteRef: PropTypes.func.isRequired
}

PlanDay.defaultProps = {
	devoCompleted: true,
	hasDevo: true
}

export default PlanDay