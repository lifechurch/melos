import React, { PropTypes } from 'react'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import moment from 'moment'
import { dayHasDevo } from '../../../lib/readingPlanUtils'

function PlanDayStatus(props) {
	const { calendar, total, day } = props
	const today = moment()
	let missedDays = 0
	let aheadDays = 0

	calendar.forEach((d) => {
		const curDate = moment(d.date)
		const hasContent = (d.references.length > 0 || dayHasDevo(d.additional_content))
		// 'rest days' don't count towards progress
		if (
				hasContent &&
				!d.completed &&
				curDate.isBefore(today, 'day')
			) {
			missedDays++
		}
		if (
				hasContent &&
				d.completed &&
				curDate.isAfter(today, 'day')
			) {
			aheadDays++
		}
	})

	let onTrackStatus
	if (missedDays === 1) {
		onTrackStatus = <FormattedMessage id="plans.status.missed days.one" values={{ count: missedDays }} />
	} else if (missedDays > 0) {
		onTrackStatus = <FormattedMessage id="plans.status.missed days.other" values={{ count: missedDays }} />
	} else if (aheadDays === 1) {
		onTrackStatus = <FormattedMessage id="plans.status.days ahead.one" values={{ count: aheadDays }} />
	} else if (aheadDays > 1) {
		onTrackStatus = <FormattedMessage id="plans.status.days ahead.other" values={{ count: aheadDays }} />
	} else {
		onTrackStatus = <FormattedMessage id="plans.status.on track" />
	}

	return (
		<p>
			<FormattedHTMLMessage id="plans.which day in plan" values={{ day, total }} />
			&nbsp;&bull;&nbsp;
			{onTrackStatus}
		</p>
	)
}

PlanDayStatus.propTypes = {
	day: PropTypes.number.isRequired,
	calendar: PropTypes.array.isRequired,
	total: PropTypes.number.isRequired,
}

export default PlanDayStatus
