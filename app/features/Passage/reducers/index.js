import { combineReducers } from 'redux'

import verses from './verses'
import readingPlans from './readingPlans'
import configuration from './readingPlansConfiguration'
import altVersions from './altVersions'

const biblePassageReducer = combineReducers({
	configuration,
	verses,
	readingPlans,
	altVersions
})

export default biblePassageReducer
