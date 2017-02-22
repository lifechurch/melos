import React, { PropTypes } from 'react'
import moment from 'moment'

import Calendar from './Calendar'

function PlanComponent(props) {
	const { plan, subscriptionLink } = props
	const months = {}
	const calendars = []

	if ('calendar' in plan) {
		plan.calendar.forEach((day, i) => {
			const date = moment(day.date)
			const year = date.year()
			const month = date.month() + 1
			const dayOfMonth = date.date()
			const today = moment()

			if (calendars.indexOf(`${year}-${month}`) === -1) {
				calendars.push(`${year}-${month}`)
			}

			let prevComplete = false
			if (i > 0) {
				prevComplete = plan.calendar[i - 1].completed
			}

			let nextComplete = false
			if (i < (plan.calendar.length - 1)) {
				nextComplete = plan.calendar[i + 1].completed
			}

			let complete = 'Incomplete'
			if (day.completed) {
				complete = 'Complete'
			} else if (
        ('additional_content' in day && day.additional_content.completed && (day.additional_content.html !== null || day.additional_content.text !== null)) ||
        ('references_completed' in day && day.references_completed.length > 0)
      ) {
				complete = 'Partial'
			} else if (date.isSameOrAfter(today)) {
				complete = 'Future'
			}

			let streak = 'None'
			if (prevComplete && day.completed && nextComplete) {
				streak = 'Middle'
			} else if (prevComplete && day.completed) {
				streak = 'End'
			} else if (nextComplete && day.completed) {
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
		<div className="row" style={{ marginTop: 30 }}>
			<div className="columns medium-8 large-8 medium-centered text-center">
				<div className={`plan-calendar-collection ${calendars.length === 1 && 'single'}`}>
					{calendars.map((calendarKey) => {
						const [yearString, monthString] = calendarKey.split('-')
						const year = parseInt(yearString, 10)
						const month = parseInt(monthString, 10)
						return (
							<Calendar
								key={`${year}-${month}`}
								showFullWeeks={false}
								monthNumber={month}
								yearNumber={year}
								data={months}
							/>
						)
					})}
				</div>
			</div>
		</div>
	)
}

PlanComponent.propTypes = {
	plan: PropTypes.object.isRequired,
	subscriptionLink: PropTypes.string.isRequired
}

PlanComponent.defaultProps = {

}

export default PlanComponent
