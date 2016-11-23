const constants = {

	/* API CALLS */
	bibleConfigurationRequest: "BIBLE_CONFIGURATION_REQUEST",
	bibleConfigurationSuccess: "BIBLE_CONFIGURATION_SUCCESS",
	bibleConfigurationFailure: "BIBLE_CONFIGURATION_FAILURE",

	bibleVersesRequest: "BIBLE_VERSES_REQUEST",
	bibleVersesSuccess: "BIBLE_VERSES_SUCCESS",
	bibleVersesFailure: "BIBLE_VERSES_FAILURE",

}

export default function (key) {
	if (typeof key === 'string' && constants.hasOwnProperty(key)) {
		return constants[key];
	} else {
		throw new Error('Invalid Passage Render Action: ' + key)
	}
}
