import React from 'react'
import PropTypes from 'prop-types'
import glamorous from 'glamorous'
import getThemeForComponent from '../../themes/utils/getThemeForComponent'

function Body(props) {
  const { children, muted } = props
  const ThemedElement = glamorous.p({}, ({ theme }) => {
    return getThemeForComponent('Body', theme, props, (t) => {
      return {
        fontFamily: t.fontFamily.primary,
        fontWeight: t.fontWeight.normal,
        fontSize: t.fontSize.default,
        lineHeight: t.lineHeight.medium,
        color: muted ? t.color.muted : t.color.text,
        padding: t.padding.none,
        margin: t.margin.none
      }
    })
  })

  return (
    <ThemedElement>
      {children}
    </ThemedElement>
  )
}

Body.propTypes = {
  children: PropTypes.node,
  muted: PropTypes.bool,
  theme: PropTypes.object
}

Body.defaultProps = {
  children: null,
  muted: false,
  theme: null
}

export default Body
