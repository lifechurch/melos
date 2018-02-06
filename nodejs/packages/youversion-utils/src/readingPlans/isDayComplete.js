import Immutable from 'immutable'

/**
 * Determines if final reading content for a
 * specific reading plan day based on the list of bools for segment progress.
 *
 * @return     {boolean}  True if final reading content, False otherwise.
 */
export default function isDayComplete(dayProgress) {
	if (!dayProgress) return false
	// if day progress doesn't include a false value, then it's complete
	return !(Immutable.List(dayProgress).includes(false))
}
