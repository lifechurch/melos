import { combineReducers } from 'redux'

import verses from './verses/verses'
import versions from './verses/versions'
import primaryVersion from './verses/primaryVersion'

const biblePassageReducer = combineReducers({
	primaryVersion,
	verses,
	versions
})

export default biblePassageReducer
