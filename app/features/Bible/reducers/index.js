import { combineReducers } from 'redux'
import audio from './audio'
import books from './books'
import chapter from './chapter'
import chapters from './chapters'
import highlightColors from './highlightColors'
import languages from './languages'
import show from './show'
import verseAction from './verseAction'
import verseSelection from './verseSelection'
import versions from './versions'

const bibleReaderReducer = combineReducers({
	audio,
	books,
	chapter,
	chapters,
	highlightColors,
	languages,
	show,
	verseAction,
	verseSelection,
	versions
})

export default bibleReaderReducer
