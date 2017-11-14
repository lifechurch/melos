import React, { PropTypes } from 'react'
import { ThemeProvider } from 'glamorous'
import ObjectAssignDeep from 'object-assign-deep'
import ThemeConstants from '../constants'

function Theme({ definition, children }) {
  const mergedTheme = ObjectAssignDeep({}, ThemeConstants, definition)
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
