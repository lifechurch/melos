import Immutable from 'immutable'
import DefaultThemeConstants from '../../themes/constants'

export default function getThemeForComponent(name, theme = {}, props = {}, defaultReducer) {
  const { [name]: reducer = defaultReducer, constants = {} } = theme
  const mergedConstants = Immutable
    .fromJS(DefaultThemeConstants)
    .mergeDeep(constants)
    .toJS()
  return reducer(mergedConstants, props)
}
