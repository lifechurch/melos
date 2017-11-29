import React, { PropTypes } from 'react'
import { ThemeProvider } from 'glamorous'
import Immutable from 'immutable'
import ThemeConstants from '../constants'

function Theme({ definition, children }) {
  const mergedTheme = Immutable
    .fromJS(ThemeConstants)
    .mergeDeep(definition)
    .toJS()
  return (
    <ThemeProvider theme={mergedTheme}>
      {children}
    </ThemeProvider>
  )
}

Theme.propTypes = {
  definition: PropTypes.object,
  children: PropTypes.node
}

Theme.defaultProps = {
  definition: ThemeConstants,
  children: null
}

export default Theme
