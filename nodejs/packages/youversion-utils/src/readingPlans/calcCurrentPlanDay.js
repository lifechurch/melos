import moment from 'moment'

/**
 * if no day is passed to a subscription then we want to figure out
 * what day to start on based on the date and the start date of the plan
 * @param  {[number]} total_days [total days in plan]
 * @param  {[string]} start_dt   [start date of plan]
 * @return {[number]}            [current day of plan]
 */
export default function calcCurrentPlanDay({ total_days, start_dt }) {
	const calculatedDay = Math.abs(
		parseInt(
      moment().startOf('day')
        .diff(
          moment(start_dt, 'YYYY-MM-DD').startOf('day'),
          'days'
        )
      , 10
    )
	) + 1
	let currentDay
	if (calculatedDay > total_days) {
		currentDay = total_days
	} else {
		currentDay = calculatedDay
	}

	if (Number.isNaN(currentDay)) {
		return 1
	} else {
		return currentDay
	}
}
