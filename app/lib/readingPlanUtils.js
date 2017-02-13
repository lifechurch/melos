/**
 * Determines if final reading content for a
 * specific reading plan day.
 *
 * @param      {object}   planDay         The plan day object from calendar
 * @param      {string}   currentRef      The current reference
 * @param      {boolean}  isCheckingDevo  Indicates if checking devo
 * @return     {boolean}  True if final reading content, False otherwise.
 */
export default function isFinalReadingForDay(planDay, currentRef, isCheckingDevo = false) {
	let isDevoCompleted, isFinalRef = false
	// either devo is already completed, or
	// all refs are completed and we're checking if the devo is the last
	// content to be completed
	if (isCheckingDevo) {
		isDevoCompleted = true
	} else {
		isDevoCompleted = planDay.additional_content.completed
	}

	// either all refs are already completed, or this current ref
	// is the last remaining to be completed
	if (planDay.refs_completed) {
		isFinalRef = true
	} else if (currentRef) {
		for (let i = 0; i < planDay.references_remaining.length; i++) {
			const ref = planDay.references_remaining[i]
			// if the current ref is the only ref remaining
			if (ref.toString() === currentRef.toString() && planDay.references_remaining.length === 1) {
				isFinalRef = true
			}
		}
	}

	// if the devo is already complete (or we're checking devo), and this is the last
	// incomplete ref (or refs are all complete), then this is the last content for the day
	return (isDevoCompleted && isFinalRef)
}

export function isFinalPlanDay(day, calendar, completion_percentage, total_days) {
	const dayNum = parseInt(day, 10)
	const planDay = calendar[dayNum - 1]
	const completionPercentage = parseInt(completion_percentage, 10)
	const totalDays = parseInt(total_days, 10)

	// if the day we're on is already completed, and the plan isn't completed yet
	// then this isn't the last uncompleted day in the plan
	if (planDay.completed) {
		return false
	}

	// if this day isn't completed yet, let's check the completion percentage in relation
	// to the total_days of the plan
	// this will shortcut a lot of longer plans so we don't have to loop through checking
	// each day
	if (completionPercentage < 95 && totalDays > 20) {
		return false
	} else {
		// if total days is 20 or less or completion is 95 or greater, then let's
		// loop through and check if every day is complete apart from the current
		for (let i = totalDays - 1; i >= 0; i--) {
			const dayObj = calendar[i]
			// if we find a day that is not complete, and it's not the day that we're currently
			// on, then we have more days to go
			if (dayObj.day !== dayNum && !dayObj.completed) {
				return false
			}
		}
	}

	// if we've passed all these checks, then this must be the last uncompleted plan day!
	return true
}
