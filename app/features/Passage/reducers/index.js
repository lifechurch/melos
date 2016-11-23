import { combineReducers } from 'redux'

import verses from './verses'


const biblePassageReducer = combineReducers({
	verses,
})

export default biblePassageReducer
