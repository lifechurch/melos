import { combineReducers } from 'redux'

import verses from './verses'
import readingPlans from './readingPlans'
import configuration from './readingPlansConfiguration'

const biblePassageReducer = combineReducers({
	configuration,
	verses,
	readingPlans,
})

export default biblePassageReducer
