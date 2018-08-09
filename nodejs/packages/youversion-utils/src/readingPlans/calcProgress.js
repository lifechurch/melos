import React from 'react'
import moment from 'moment'
import { FormattedMessage } from 'react-intl'
import calcTodayVsStartDt from './calcTodayVsStartDt'

function calcProgress({ progressDays = {}, start_dt = null }) {
	const overall = {
		completion_percentage: 0,
		progress_string: ''
	}

	const days = Array.isArray(progressDays)
    ? progressDays
    : Object.keys(progressDays).map((d) => { return progressDays[d] })
	if (days && days.length > 0) {
		const totalDays = days.length
		let completed = 0
		let aheadDays = 0
		let missedDays = 0
		days.forEach((day, i) => {
			const start = start_dt
				? moment(start_dt)
				: moment()
			const date = start.add(i, 'days').format('YYYY-MM-DD')
			const {
        isInFuture,
        isInPast,
      } = calcTodayVsStartDt(date)

			if (day.complete) {
				completed++
				if (start_dt && isInFuture) {
					aheadDays++
				}
			} else if (start_dt && isInPast) {
				missedDays++
			}
		})

		overall.completion_percentage = Math.round((completed / totalDays) * 100)
		if (missedDays === 1) {
			overall.progress_string = (
				<FormattedMessage
					id="plans.status.missed days.one"
					values={{ count: missedDays }}
				/>
			)
		} else if (missedDays > 0) {
			overall.progress_string = (
				<FormattedMessage
					id="plans.status.missed days.other"
					values={{ count: missedDays }}
				/>
			)
		} else if (aheadDays === 1) {
			overall.progress_string = (
				<FormattedMessage
					id="plans.status.days ahead.one"
					values={{ count: aheadDays }}
				/>
			)
		} else if (aheadDays > 1) {
			overall.progress_string = (
				<FormattedMessage
					id="plans.status.days ahead.other"
					values={{ count: aheadDays }}
				/>
			)
		} else {
			overall.progress_string = (
				<FormattedMessage
					id="plans.status.on track"
				/>
			)
		}

	}
	return overall
}

export default calcProgress
