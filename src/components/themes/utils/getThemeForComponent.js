import ObjectAssignDeep from 'object-assign-deep'
import DefaultThemeConstants from '../../themes/constants'

export default function getThemeForComponent(name, theme = {}, props = {}, defaultReducer) {
  const { [name]: reducer = defaultReducer, constants = {} } = theme
  const mergedConstants = ObjectAssignDeep({}, DefaultThemeConstants, constants)
  return reducer(mergedConstants, props)
}
