const constants = {

	/* Multi Calls */
	loadVersionAndChapter: "READER_LOAD_VERSION_AND_CHAPTER",

	/* API CALLS */
	bibleConfigurationRequest: "BIBLE_CONFIGURATION_REQUEST",
	bibleConfigurationSuccess: "BIBLE_CONFIGURATION_SUCCESS",
	bibleConfigurationFailure: "BIBLE_CONFIGURATION_FAILURE",

	bibleChapterRequest: "BIBLE_CHAPTER_REQUEST",
	bibleChapterSuccess: "BIBLE_CHAPTER_SUCCESS",
	bibleChapterFailure: "BIBLE_CHAPTER_FAILURE",

	bibleVersionRequest: "BIBLE_VERSION_REQUEST",
	bibleVersionSuccess: "BIBLE_VERSION_SUCCESS",
	bibleVersionFailure: "BIBLE_VERSION_FAILURE",

	bibleVersionsRequest: "BIBLE_VERSIONS_REQUEST",
	bibleVersionsSuccess: "BIBLE_VERSIONS_SUCCESS",
	bibleVersionsFailure: "BIBLE_VERSIONS_FAILURE",

	momentsColorsRequest: "MOMENTS_COLORS_REQUEST",
	momentsColorsSuccess: "MOMENTS_COLORS_SUCCESS",
	momentsColorsFailure: "MOMENTS_COLORS_FAILURE",

	usersViewSettingsRequest: "USERS_VIEW_SETTINGS_REQUEST",
	usersViewSettingsSuccess: "USERS_VIEW_SETTINGS_SUCCESS",
	usersViewSettingsFailure: "USERS_VIEW_SETTINGS_FAILURE",

	usersUpdateSettingsRequest: "USERS_UPDATE_SETTINGS_REQUEST",
	usersUpdateSettingsSuccess: "USERS_UPDATE_SETTINGS_SUCCESS",
	usersUpdateSettingsFailure: "USERS_UPDATE_SETTINGS_FAILURE",

	momentsCreateRequest: "MOMENTS_CREATE_REQUEST",
	momentsCreateSuccess: "MOMENTS_CREATE_SUCCESS",
	momentsCreateFailure: "MOMENTS_CREATE_FAILURE",

	momentsLabelsRequest: "MOMENTS_LABELS_REQUEST",
	momentsLabelsSuccess: "MOMENTS_LABELS_SUCCESS",
	momentsLabelsFailure: "MOMENTS_LABELS_FAILURE",

	momentsVerseColorsRequest: "MOMENTS_VERSE_COLORS_REQUEST",
	momentsVerseColorsSuccess: "MOMENTS_VERSE_COLORS_SUCCESS",
	momentsVerseColorsFailure: "MOMENTS_VERSE_COLORS_FAILURE",

	/* Book Selector */
	bookSelectorOpen: "READER_BOOK_SELECTOR_OPEN",
	bookSelectorClose: "READER_BOOK_SELECTOR_CLOSE",
	bookSelectorSelectBook: "READER_BOOK_SELECTOR_SELECT_BOOK",
	bookSelectorSelectChapter: "READER_BOOK_SELECTOR_SELECT_CHAPTER",

	/* Book Filter */
	bookSelectorFilterBooks: "READER_BOOK_SELECTOR_FILTER_BOOKS",
	bookSelectorCancelFilter: "READER_BOOK_SELECTOR_CANCEL_FILTER",
	bookSelectorFilterBookSelect: "READER_BOOK_SELECTOR_FILTER_BOOK_SELECT",
	bookSelectorFilterChapterSelect: "READER_BOOK_SELECTOR_FILTER_CHAPTER_SELECT",

	/* Version Selector */
	versionSelectorOpen: "READER_VERSION_SELECTOR_OPEN",
	versionSelectorClose: "READER_VERSION_SELECTOR_CLOSE",
	versionSelectorSelectLanguage: "READER_VERSION_SELECTOR_SELECT_LANGUAGE",
	versionSelectorSelectVersion: "READER_VERSION_SELECTOR_SELECT_VERSION",
	versionSelectorFilterLanguages: "READER_VERSION_SELECTOR_FILTER_LANGUAGES",

	/* Version Filter */
	versionSelectorFilterVersions: "READER_VERSION_SELECTOR_FILTER_VERSIONS",
	versionSelectorCancelFilter: "READER_VERSION_SELECTOR_CANCEL_FILTER",
	versionSelectorFilterVersionSelect: "READER_VERSION_SELECTOR_FILTER_VERSION_SELECT",

	/* Audio */
	audioOpen: "READER_AUDIO_OPEN",
	audioClose: "READER_AUDIO_CLOSE",
	audioLoaded: "READER_AUDIO_LOADED",
	audioPlay: "READER_AUDIO_PLAY",
	audioSeek: "READER_AUDIO_SEEK",
	audioSpeed: "READER_AUDIO_CHANGE_SPEED",
	audioNewWindow: "READER_AUDIO_NEW_WINDOW",

	/* Settings */
	fontChangeSize: "READER_SETTINGS_FONT_CHANGE_SIZE",
	fontChangeFamily: "READER_SETTINGS_FONT_CHANGE_FAMILY",
	footnotesToggle: "READER_SETTINGS_FOOTNOTES_TOGGLE",
	numbersAndTitlesToggle: "READER_SETTINGS_NUMBERS_AND_TITLES_TOGGLE",

	/* Verse Action */
	verseActionOpen: "READER_VERSE_ACTION_OPEN",
	verseActionClose: "READER_VERSE_ACTION_CLOSE",
	verseActionShareOpen: "READER_VERSE_ACTION_SHARE_OPEN",
	verseActionShareClose: "READER_VERSE_ACTION_SHARE_CLOSE",
	verseActionCopyOpen: "READER_VERSE_ACTION_COPY_OPEN",
	verseActionCopyClose: "READER_VERSE_ACTION_COPY_CLOSE",
	verseActionBookmarkOpen: "READER_VERSE_ACTION_BOOKMARK_OPEN",
	verseActionBookmarkClose: "READER_VERSE_ACTION_BOOKMARK_CLOSE",
	verseActionNoteOpen: "READER_VERSE_ACTION_NOTE_OPEN",
	verseActionNoteClose: "READER_VERSE_ACTION_NOTE_CLOSE"
}

export default function (key) {
	if (typeof key === 'string' && constants.hasOwnProperty(key)) {
		return constants[key];
	} else {
		throw new Error('Invalid Bible Reader Action: ' + key)
	}
}
