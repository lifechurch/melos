/**
 * calculate which indices the talk it overs appear in the full exploded daySegments
 * @param  {[array]} daySegments [array of segments for a specific plan day]
 * @return {[array]}             [array mapping the appearance of tio to it's
 * index in the daysegments. i.e. a tio which appears as the 3rd segment will be returned
 * as [2]. this says that the first tio is at index 2. if we have multiple tio, then the
 * index into this array will be the appearance order. i.e. [2, 4] says that the 2nd tio
 * is at index 4 of daySegments]
 */
export default function mapTioIndices(daySegments) {
	const tioIndices = []
	if (daySegments) {
		daySegments.forEach((seg, i) => {
			if (seg.kind === 'talk-it-over') {
				tioIndices.push(i)
			}
		})
	}
	return tioIndices
}
