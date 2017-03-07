import ActionCreators from '../features/PlanDiscovery/actions/creators'
import BibleActionCreators from '../features/Bible/actions/creators'

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
	// either we have no refs, all refs are already completed, or this current ref
	// is the last remaining to be completed
	if (planDay.references.length < 1) {
		isFinalRef = true
	} else if (planDay.refs_completed) {
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


export function isFinalPlanDay(day, calendar, total_days) {
	const dayNum = parseInt(day, 10)
	const planDay = calendar[dayNum - 1]
	const totalDays = parseInt(total_days, 10)

	// if the day we're on is already completed, and the plan isn't completed yet
	// then this isn't the last uncompleted day in the plan
	if (planDay.completed) {
		return false
	}

	// start at the end of the calendar and check for an uncomplete day that's not
	// the current one
	for (let i = totalDays - 1; i >= 0; i--) {
		const dayObj = calendar[i]
			// if we find a day that is not complete, and it's not the day that we're currently
			// on, then we have more days to go
		if (dayObj.day !== dayNum && !dayObj.completed) {
			return false
		}
	}

	// if we've passed all these checks, then this must be the last uncompleted plan day!
	return true
}


export function dayHasDevo(additional_content) {
	return 	(!!additional_content.html) ||
					(!!additional_content.text)
}


export function handleRefUpdate(
	completedRefs,
	isDevo,
	hasDevo,
	devoCompleted,
	currentRef,
	complete,
	planId,
	dayNum,
	dispatch
) {
	const references = completedRefs
	let completeDevo = true
	// devotional is true by default if there is no devotional
	// otherwise this will overwrite with the correct value
	if (hasDevo) {
		completeDevo = (isDevo && complete) || devoCompleted
	}
	// if we have a reference, that we're reading through,
	// add it to the list of completedRefs
	if (currentRef && complete) {
		references.push(currentRef)
	} else if (currentRef) {
		references.splice(references.indexOf(currentRef), 1)
	}

	// make api call
	dispatch(ActionCreators.updatePlanDay({
		id: planId,
		day: dayNum,
		references,
		devotional: completeDevo,
	}, true))
}


/**
 * get default version for a language
 * the store is used to check current state and dipatch the bible config action
 * if the language list isn't already in state
 */
export function getDefaultVersion(store, locale) {
	const currentState = store.getState()
	const language_tag = locale ? locale.toString() : 'eng'
	let defaultVersion = 1
	if (currentState.bibleReader.languages.map && currentState.bibleReader.languages.map[language_tag]) {
		defaultVersion = currentState.bibleReader.languages.all[currentState.bibleReader.languages.map[language_tag]].id
	} else {
		store.dispatch(BibleActionCreators.bibleConfiguration()).then((d) => {
			const langs = store.getState().bibleReader.languages
			if (language_tag in langs.map) {
				defaultVersion = langs.all[langs.map[language_tag]].id
			}
		})
	}
	return defaultVersion
}
