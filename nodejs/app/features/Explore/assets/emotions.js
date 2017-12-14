const emotions = {
	allCategories: [
		'happy',
		'afraid',
		'mad',
		'sad'
	],
	byCategory: {
		afraid: [
			'abandoned',
			'afraid',
			'anxious',
			'confused',
			'lost',
			'nervous',
			'overwhelmed',
			'stressed',
			'uncomfortable',
			'worried'
		],
		happy: [
			'amazed',
			'content',
			'faithful',
			'happy',
			'hopeful',
			'joyful',
			'loved',
			'optimistic',
			'peaceful',
			'thankful'
		],
		mad: [
			'angry',
			'annoyed',
			'attacked',
			'disrespected',
			'frustrated',
			'hateful',
			'hostile',
			'irrational',
			'jealous',
			'rage'
		],
		sad: [
			'ashamed',
			'depressed',
			'discouraged',
			'forgotten',
			'hopeless',
			'hurt',
			'lonely',
			'sad',
			'sick',
			'tired'
		]
	}
}
export default emotions

export function getCategoryFromEmotion(emotion) {
	// 'sad' (maybe unfortunately) is the most popular category based on metrics
	// so if there is no speciic match then default to 'sad'
	if (!emotion) return 'sad'
	let category
	emotions.allCategories.some((cat) => {
		category = cat
		const emotionsToCheck = emotions.byCategory[cat]
		// match joy(ful) with happy
		return emotionsToCheck
			&& (
				emotionsToCheck.includes(emotion.toLowerCase())
				|| emotionsToCheck.some((emo) => {
					return emo.startsWith(emotion.toLowerCase())
				})
			)
	})
	return category
}
