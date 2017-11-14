import React from 'react'
import PropTypes from 'prop-types'
import glamorous from 'glamorous'
import getThemeForComponent from '../../themes/utils/getThemeForComponent'

function Caption1(props) {
  const { children, muted } = props

  const ThemedElement = glamorous.p({}, ({ theme }) => {
    return getThemeForComponent('Caption1', theme, props, (t) => {
      return {
        fontFamily: t.fontFamily.primary,
        fontWeight: t.fontWeight.normal,
        fontSize: t.fontSize.small,
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

Caption1.propTypes = {
  children: PropTypes.node,
  muted: PropTypes.bool
}

Caption1.defaultProps = {
  children: null,
  muted: false
}

export default Caption1
