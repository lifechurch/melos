export default function hasUserCompletedActivity(dayActivities, userid) {
	let hasCompleted = false
	if (dayActivities && Object.keys(dayActivities).length > 0) {
		Object.keys(dayActivities).forEach((id) => {
			const completion = dayActivities[id]
			if (
				completion.kind === 'complete' &&
				parseInt(completion.user_id, 10) === parseInt(userid, 10)
			) {
				hasCompleted = true
			}
		})
	}
	return hasCompleted
}
