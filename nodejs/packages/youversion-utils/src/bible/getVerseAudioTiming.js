export default function getVerseAudioTiming(startRef, endRef, timing) {
	const audioTiming = {
		startTime: null,
		endTime: null
	}

	if (!Array.isArray(timing)) {
		return audioTiming
	}

	for (let i = 0; i < timing.length; i++) {
		const ref = timing[i]
		if (startRef.toString().toLowerCase() === ref.usfm.toString().toLowerCase()) {
			audioTiming.startTime = ref.start
		}
		if (endRef.toString().toLowerCase() === ref.usfm.toString().toLowerCase()) {
			audioTiming.endTime = ref.end
		}

		if (audioTiming.startTime && audioTiming.endTime) {
			return audioTiming
		}
	}

	return audioTiming
}
