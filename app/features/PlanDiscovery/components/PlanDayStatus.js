import React, { PropTypes, Component } from 'react'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import moment from 'moment'

class PlanDayStatus extends Component {
	render() {
		const { plan, day } = this.props
		const today = moment()
		let missedDays = 0
		let aheadDays = 0

		plan.calendar.forEach((d) => {
			const curDate = moment(d.date)

			if (d.completed && (curDate < today)) {
				missedDays++
			}

			if (d.completed && (curDate > today)) {
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
				<FormattedHTMLMessage id="plans.which day in plan" values={{ day: day, total: plan.total_days }} />
				&nbsp;&bull;&nbsp;
				{onTrackStatus}
			</p>
		)
	}
}

PlanDayStatus.propTypes = {
	day: PropTypes.number.isRequired,
	plan: PropTypes.object.isRequired
}

export default PlanDayStatus