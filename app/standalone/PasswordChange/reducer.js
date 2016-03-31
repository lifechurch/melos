import { combineReducers } from 'redux'
import Password from '../../features/PasswordChange/reducers/PasswordChange'

const auth = (state = {}, action) => { return state }

export default combineReducers({
	Password,
	auth
})

