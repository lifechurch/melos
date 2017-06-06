import { combineReducers } from 'redux'
import audio from './audio'
import audioChapter from './audioChapter'
import books from './books'
import chapter from './chapter'
import parallelChapter from './parallelChapter'
import chapters from './chapters'
import highlightColors from './highlightColors'
import languages from './languages'
import show from './show'
import momentsLabels from './momentsLabels'
import version from './version'
import parallelVersion from './parallelVersion'
import versions from './versions'
import verses from './verses'
import settings from './settings'
import verseColors from './verseColors'

const bibleReaderReducer = combineReducers({
	audio,
	audioChapter,
	books,
	chapter,
	parallelChapter,
	chapters,
	highlightColors,
	languages,
	settings,
	show,
	momentsLabels,
	verses,
	version,
	parallelVersion,
	versions,
	verseColors
})

export default bibleReaderReducer
