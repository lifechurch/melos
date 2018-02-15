import React from 'react'
import PropTypes from 'prop-types'
import glamorous from 'glamorous'
import getThemeForComponent from '../../themes/utils/getThemeForComponent'

function Heading3(props) {
  const { children, muted } = props

  const ThemedElement = glamorous.h3({}, ({ theme }) => {
    return getThemeForComponent('Heading3', theme, props, (t) => {
      return {
        fontFamily: t.fontFamily.primary,
        fontWeight: t.fontWeight.semibold,
        fontSize: t.fontSize.default,
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

Heading3.propTypes = {
  children: PropTypes.node,
  muted: PropTypes.bool
}

Heading3.defaultProps = {
  children: null,
  muted: false
}

export default Heading3
