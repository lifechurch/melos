
export default function isFinalSegmentToComplete(segIndex, dayProgress) {
	if (!dayProgress) return false
	let isFinal = true
	dayProgress.forEach((segComplete, i) => {
		// if any of the segments we're not currently on is not complete, than this
		// seg is not the final reading for the day
		if (i !== parseInt(segIndex, 10) && !segComplete) {
			isFinal = false
		}
	})
	return isFinal
}
