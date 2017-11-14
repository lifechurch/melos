import React from 'react'
import PropTypes from 'prop-types'
import glamorous from 'glamorous'
import getThemeForComponent from '../../themes/utils/getThemeForComponent'

function Heading2(props) {
  const { children, muted } = props
  const ThemedElement = glamorous.h2({}, ({ theme }) => {
    return getThemeForComponent('Heading2', theme, props, (t) => {
      return {
        fontFamily: t.fontFamily.primary,
        fontWeight: t.fontWeight.emibold,
        fontSize: t.fontSize.large,
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

Heading2.propTypes = {
  children: PropTypes.node,
  muted: PropTypes.bool
}

Heading2.defaultProps = {
  children: null,
  muted: false
}

export default Heading2
