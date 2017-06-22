import moment from 'moment'
import Immutable from 'immutable'
import ActionCreators from '../features/PlanDiscovery/actions/creators'
import BibleActionCreators from '../features/Bible/actions/creators'

/**
 * Determines if final reading content for a
 * specific reading plan day.
 *
 * @return     {boolean}  True if final reading content, False otherwise.
 */
export function isDayComplete(dayProgress) {
	if (!dayProgress) return false
	// if day progress doesn't include a false value, then it's complete
	return !(Immutable.List(dayProgress).includes(false))
}

export function isPlanComplete(day, progressDays, total_days) {
	const dayNum = parseInt(day, 10)
	const planDay = progressDays[dayNum - 1]
	const totalDays = parseInt(total_days, 10)

	// if the day we're on is already completed, and the plan isn't completed yet
	// then this isn't the last uncompleted day in the plan
	if (planDay.completed) {
		return false
	}

	// start at the end of the progressDays and check for an uncomplete day that's not
	// the current one
	for (let i = totalDays - 1; i >= 0; i--) {
		const dayObj = progressDays[i]
			// if we find a day that is not complete, and it's not the day that we're currently
			// on, then we have more days to go
		if (dayObj.day !== dayNum && !dayObj.completed) {
			return false
		}
	}

	// if we've passed all these checks, then this must be the last uncompleted plan day!
	return true
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

/**
 * if no day is passed to a subscription then we want to figure out
 * what day to start on based on the date and the start date of the plan
 * @param  {[number]} total_days [total days in plan]
 * @param  {[string]} start_dt   [start date of plan]
 * @return {[number]}            [current day of plan]
 */
export function calcCurrentPlanDay({ total_days, start_dt }) {
	const calculatedDay = moment().diff(moment(start_dt, 'YYYY-MM-DD'), 'days') + 1
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
