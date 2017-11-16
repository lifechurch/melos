import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import users from '@youversion/api-redux/lib/endpoints/users/reducer'

const emptyReducer = (state = {}) => { return state }

const rootReducer = combineReducers({
  auth: emptyReducer,
  bibleReader: emptyReducer,
  eventFeeds: emptyReducer,
  content: emptyReducer,
  event: emptyReducer,
  modals: emptyReducer,
  loc: emptyReducer,
  locations: emptyReducer,
  plans: emptyReducer,
  plansDiscovery: emptyReducer,
  configuration: emptyReducer,
  references: emptyReducer,
  routing: routerReducer,
  serverLanguageTag: emptyReducer,
  altVersions: emptyReducer,
  hosts: emptyReducer,
  passage: emptyReducer,
  locale: emptyReducer,
  userId: emptyReducer,
  api: combineReducers({
    users,
  })
})

export default rootReducer
