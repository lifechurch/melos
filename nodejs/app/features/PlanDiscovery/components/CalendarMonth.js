import React, { PropTypes } from 'react'
import moment from 'moment'
import Immutable from 'immutable'


function getDaysInMonth(month, year, fullWeeks = true, direction = 1, startDate = null, limit = null) {
	const lastDayOfMonth = new Date(year, month + 1, 0)
	const d = (startDate !== null) ? startDate : new Date(year, month, 1)
	let days = []

	while (d.getMonth() === month && (limit === null || days.length < limit)) {
		// First Day not Sunday
		if (fullWeeks && startDate === null && d.getDate() === 1 && d.getDay() !== 0) {
			days = days.concat(getDaysInMonth(month - 1, year, true, -1, moment(d).subtract(1, 'days').toDate(), d.getDay()))
		}

		days.push(new Date(d))

		// Last Day not Saturday
		if (fullWeeks && startDate === null && d.getDate() === lastDayOfMonth.getDate() && d.getDay() !== 6) {
			days = days.concat(getDaysInMonth(month + 1, year, true, 1, moment(d).add(1, 'days').toDate(), (6 - d.getDay())))
		}

		d.setDate(d.getDate() + direction)
	}

	if (direction === -1) {
		days.sort((a, b) => {
			if (a.getTime() < b.getTime()) {
				return -1;
			} else if (a.getTime() > b.getTime()) {
				return 1;
			} else {
				return 0;
			}
		})
	}
	return days
}

function CalendarMonth(props) {
	const { monthNumber, yearNumber, showFullWeeks, data, children } = props
	const date = moment(new Date(yearNumber, monthNumber - 1, 1))

	const monthDays = getDaysInMonth(monthNumber - 1, yearNumber, showFullWeeks).map((day, index, days) => {
		const classNames = []

		if (!showFullWeeks) {
			// First Day of Month not Sunday
			if (index === 0 && day.getDay() !== 0) {
				classNames.push(`prefix-day-${day.getDay()}`)
			}

			// Last Day of Month not Saturday
			if (index === (days.length - 1) && day.getDay !== 7) {
				classNames.push(`suffix-day-${7 - day.getDay()}`)
			}
		}

		let dayData = {}
		const m = moment(day)
		const iData = Immutable.fromJS(data)
		const key = [
			m.year().toString(),
			(m.month() + 1).toString(),
			m.date().toString()
		]

		if (iData.hasIn(key)) {
			dayData = iData.getIn(key).toJS()
		}

		return (
			<div key={day.toString()} className={`day ${classNames.join(' ')}`}>
				{ children({ day, dayData }) }
			</div>
		)
	})

	return (
		<div className='plan-calendar-container'>
			<h2>
				<span className='month'>{date.format('MMMM')}</span> &nbsp;
				<span className='year'>{date.format('YYYY')}</span>
			</h2>
			<div className='plan-calendar'>
				{ monthDays }
			</div>
		</div>
	)
}

CalendarMonth.propTypes = {
	monthNumber: PropTypes.number.isRequired,
	yearNumber: PropTypes.number.isRequired,
	children: PropTypes.func.isRequired,
	showFullWeeks: PropTypes.bool,
	data: PropTypes.object
}

CalendarMonth.defaultProps = {
	monthNumber: new Date().getMonth(),
	yearNumber: new Date().getYear(),
	showFullWeeks: true,
	data: {}
}

export default CalendarMonth
