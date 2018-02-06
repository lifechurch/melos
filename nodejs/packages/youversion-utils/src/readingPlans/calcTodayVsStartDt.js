import moment from 'moment'

function calcTodayVsStartDt(start_dt) {
	const today = moment().startOf('day')
	const startDate = moment(start_dt).startOf('day')
	const diff = today.diff(startDate, 'days')
	return {
		isInFuture: diff < 0,
		isInPast: diff > 0,
		isToday: diff === 0,
		string: `${today.to(startDate)} (${startDate.format('MMM D')})`
	}
}

export default calcTodayVsStartDt
