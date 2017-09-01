import moment from 'moment'

export default (progressDays, start_dt = null) => {
	const overall = {
		completion_percentage: 0,
		progress_string: ''
	}
	const today = moment()

	const days = Array.isArray(progressDays)
    ? progressDays
    : Object.keys(progressDays).map((d) => { return progressDays[d] })
	if (days && days.length > 0) {
		const totalDays = days.length
		let completed = 0
		let uncompleted = 0
		let aheadDays = 0
		let behindDays = 0
		days.forEach((day) => {
			const futureDay = start_dt
        && today < moment(start_dt).add(day.day, 'days')
			if (day.complete) {
				completed++
				if (futureDay) {
					aheadDays++
				}
			} else {
				uncompleted++
				if (start_dt && !futureDay) {
					behindDays++
				}
			}
		})
		overall.completion_percentage = Math.round((completed / totalDays) * 100)
	}


	return overall
}
