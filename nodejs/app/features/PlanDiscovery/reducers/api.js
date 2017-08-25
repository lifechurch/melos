import { combineReducers } from 'redux'
import users from '@youversion/api-redux/lib/endpoints/users/reducer'
import search from '@youversion/api-redux/lib/endpoints/search/reducer'
import friends from '@youversion/api-redux/lib/endpoints/friends/reducer'
import readingPlans from '@youversion/api-redux/lib/endpoints/readingPlans/reducer'
import bible from '@youversion/api-redux/lib/endpoints/bible/reducer'
import moments from '@youversion/api-redux/lib/endpoints/moments/reducer'
import audio from '@youversion/api-redux/lib/endpoints/audio/reducer'

export default combineReducers({
	users,
	search,
	friends,
	readingPlans,
	bible,
	moments,
	audio
})
