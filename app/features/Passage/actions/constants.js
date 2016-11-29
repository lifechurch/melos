const constants = {

	/* API CALLS */
	bibleConfigurationRequest: "BIBLE_CONFIGURATION_REQUEST",
	bibleConfigurationSuccess: "BIBLE_CONFIGURATION_SUCCESS",
	bibleConfigurationFailure: "BIBLE_CONFIGURATION_FAILURE",

	bibleVersesRequest: "BIBLE_VERSES_REQUEST",
	bibleVersesSuccess: "BIBLE_VERSES_SUCCESS",
	bibleVersesFailure: "BIBLE_VERSES_FAILURE",

	bibleVersionRequest: "BIBLE_VERSION_REQUEST",
	bibleVersionSuccess: "BIBLE_VERSION_SUCCESS",
	bibleVersionFailure: "BIBLE_VERSION_FAILURE",

	readingplansConfigurationRequest: "READINGPLANS_CONFIGURATION_REQUEST",
	readingplansConfigurationSuccess: "READINGPLANS_CONFIGURATION_SUCCESS",
	readingplansConfigurationFailure: "READINGPLANS_CONFIGURATION_FAILURE",

	readingplansPlansByReferenceRequest: "READINGPLANS_PLANSBYREFERENCE_REQUEST",
	readingplansPlansByReferenceSuccess: "READINGPLANS_PLANSBYREFERENCE_SUCCESS",
	readingplansPlansByReferenceFailure: "READINGPLANS_PLANSBYREFERENCE_FAILURE",

}

export default function (key) {
	if (typeof key === 'string' && constants.hasOwnProperty(key)) {
		return constants[key];
	} else {
		throw new Error('Invalid Passage Render Action: ' + key)
	}
}
