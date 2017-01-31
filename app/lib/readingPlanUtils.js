/**
 * Determines if final reading content for a
 * specific reading plan day.
 *
 * @param      {object}   planDay         The plan day
 * @param      {string}   currentRef      The current reference
 * @param      {boolean}  isCheckingDevo  Indicates if checking devo
 * @return     {boolean}  True if final reading content, False otherwise.
 */
export default function isFinalReadingContent(planDay, currentRef, isCheckingDevo=false) {
	// either devo is already completed, or
	// all refs are completed and we're checking if the devo is the last
	// content to be completed
	let isDevoCompleted = () => {
		if (isCheckingDevo) {
			return true
		} else {
			return planDay.additional_content.completed
		}
	}

	// either all refs are already completed, or this current ref
	// is the last remaining to be completed
	let isFinalRef = () => {
		if (planDay.refs_completed) {
			return true
		}

		for (let i = 0; i < planDay.references_remaining; i++) {
			let ref = planDay.references_remaining[i]
			// if the current ref is the only ref remaining
			if (ref.toString() === currentRef.toString() && planDay.references_remaining.length === 1) {
				return true
			}
		}
		// if we've looped through all remaining refs, and current ref is not
		// the only ref remaining to complete
		return false
	}
	// if the devo is already complete (or we're checking devo), and this is the last
	// incomplete ref (or refs are all complete), then this is the last content for the day
	return (isDevoCompleted() && isFinalRef())
}