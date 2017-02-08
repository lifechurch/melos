import { combineReducers } from 'redux'
import audio from './audio'
import audioChapter from './audioChapter'
import books from './books'
import chapter from './chapter'
import chapters from './chapters'
import highlightColors from './highlightColors'
import languages from './languages'
import show from './show'
import momentsLabels from './momentsLabels'
import version from './version'
import versions from './versions'
import verses from './verses'
import settings from './settings'
import verseColors from './verseColors'

const bibleReaderReducer = combineReducers({
	audio,
	audioChapter,
	books,
	chapter,
	chapters,
	highlightColors,
	languages,
	settings,
	show,
	momentsLabels,
	verses,
	version,
	versions,
	verseColors
})

export default bibleReaderReducer
