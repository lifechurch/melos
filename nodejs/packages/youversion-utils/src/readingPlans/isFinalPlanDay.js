export default function isFinalPlanDay(day, progressDays) {
	if (!day || !progressDays) return false

	const dayNum = parseInt(day, 10)
	const days = Object.keys(progressDays)
	const totalDays = parseInt(days.length, 10)

	// start at the end of the progressDays and check for an incomplete day that's not
	// the current one
	for (let i = totalDays; i > 0; i--) {
		const dayObj = progressDays[i]
			// if we find a day that is not complete, and it's not the day that we're currently
			// on, then we have more days to go
		if (dayObj && dayObj.day !== dayNum && !dayObj.complete) {
			return false
		}
	}

	// if we've passed all these checks, then this must be the last uncompleted plan day!
	return true
}
