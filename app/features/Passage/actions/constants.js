const constants = {

	passageLoadFailure: "PASSAGE_LOAD_DATA_FAILURE",
	passageLoadSuccess: "PASSAGE_LOAD_DATA_SUCCESS",

	/* API CALLS */
	bibleConfigurationRequest: "PASSAGE_BIBLE_CONFIGURATION_REQUEST",
	bibleConfigurationSuccess: "PASSAGE_BIBLE_CONFIGURATION_SUCCESS",
	bibleConfigurationFailure: "PASSAGE_BIBLE_CONFIGURATION_FAILURE",

	bibleVersesRequest: "PASSAGE_BIBLE_VERSES_REQUEST",
	bibleVersesSuccess: "PASSAGE_BIBLE_VERSES_SUCCESS",
	bibleVersesFailure: "PASSAGE_BIBLE_VERSES_FAILURE",

	bibleVersionRequest: "PASSAGE_BIBLE_VERSION_REQUEST",
	bibleVersionSuccess: "PASSAGE_BIBLE_VERSION_SUCCESS",
	bibleVersionFailure: "PASSAGE_BIBLE_VERSION_FAILURE",

	readingplansConfigurationRequest: "PASSAGE_READINGPLANS_CONFIGURATION_REQUEST",
	readingplansConfigurationSuccess: "PASSAGE_READINGPLANS_CONFIGURATION_SUCCESS",
	readingplansConfigurationFailure: "PASSAGE_READINGPLANS_CONFIGURATION_FAILURE",

	readingplansPlansByReferenceRequest: "PASSAGE_READINGPLANS_PLANSBYREFERENCE_REQUEST",
	readingplansPlansByReferenceSuccess: "PASSAGE_READINGPLANS_PLANSBYREFERENCE_SUCCESS",
	readingplansPlansByReferenceFailure: "PASSAGE_READINGPLANS_PLANSBYREFERENCE_FAILURE",

}

export default function (key) {
	if (typeof key === 'string' && constants.hasOwnProperty(key)) {
		return constants[key];
	} else {
		throw new Error('Invalid Passage Render Action: ' + key)
	}
}
