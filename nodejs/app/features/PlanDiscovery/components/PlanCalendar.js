import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import CalendarMonth from './CalendarMonth'
import StreakDay from './StreakDay'

function PlanComponent(props) {
	const { progressDays, start_dt, subscriptionLink } = props
	const months = {}
	const calendars = []

	if (progressDays && Object.keys(progressDays).length > 0) {
		Object.keys(progressDays).forEach((dayNum, i) => {
			const day = progressDays[dayNum]
			const date = moment(start_dt).add(i, 'days')
			const year = date.year()
			const month = date.month() + 1
			const dayOfMonth = date.date()
			const today = moment()

			if (calendars.indexOf(`${year}-${month}`) === -1) {
				calendars.push(`${year}-${month}`)
			}

			let prevComplete = false
			if ((parseInt(dayNum, 10) - 1) in progressDays) {
				prevComplete = progressDays[parseInt(dayNum, 10) - 1].complete
			}

			let nextComplete = false
			if ((parseInt(dayNum, 10) + 1) in progressDays) {
				nextComplete = progressDays[parseInt(dayNum, 10) + 1].complete
			}

			let complete = 'Incomplete'
			if (day.complete) {
				complete = 'Complete'
			} else if (day.partial && day.partial.length > 0) {
				complete = 'Partial'
			} else if (date.isSameOrAfter(today)) {
				complete = 'Future'
			}

			let streak = 'None'
			if (prevComplete && day.complete && nextComplete) {
				streak = 'Middle'
			} else if (prevComplete && day.complete) {
				streak = 'End'
			} else if (nextComplete && day.complete) {
				streak = 'Beginning'
			}

			const dayData = {
				date: date.toDate(),
				streak,
				complete,
				link: `${subscriptionLink}/day/${day.day}`
			}

			if (!(year in months)) {
				months[year] = {}
			}

			if (!(month in months[year])) {
				months[year][month] = {}
			}

			months[year][month][dayOfMonth] = dayData
		})
	}

	return (
		<div className='row' style={{ marginTop: '50px' }}>
			<div className='columns medium-8 large-8 medium-centered text-center'>
				<div className={`plan-calendar-collection ${calendars.length === 1 && 'single'}`}>
					{
						calendars.map((calendarKey) => {
							const [yearString, monthString] = calendarKey.split('-')
							const year = parseInt(yearString, 10)
							const month = parseInt(monthString, 10)
							return (
								<CalendarMonth
									key={`${year}-${month}`}
									showFullWeeks={false}
									monthNumber={month}
									yearNumber={year}
								>
									{
										({ day }) => {
											const dayData = months[year][month][day.getDate()]
											return (
												<StreakDay
													link={dayData && dayData.link}
													date={day}
													streak={dayData && dayData.streak}
													complete={dayData && dayData.complete}
												/>
											)
										}
									}
								</CalendarMonth>
							)
						})
					}
				</div>
			</div>
		</div>
	)
}

PlanComponent.propTypes = {
	progressDays: PropTypes.object.isRequired,
	start_dt: PropTypes.string.isRequired,
	subscriptionLink: PropTypes.string.isRequired
}

PlanComponent.defaultProps = {

}

export default PlanComponent
