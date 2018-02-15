import React from 'react'
import PropTypes from 'prop-types'
import glamorous from 'glamorous'
import getThemeForComponent from '../../themes/utils/getThemeForComponent'

function Caption2(props) {
  const { children, muted } = props
  const ThemedElement = glamorous.p({}, ({ theme }) => {
    return getThemeForComponent('Caption2', theme, props, (t) => {
      return {
        fontFamily: t.fontFamily.primary,
        fontWeight: t.fontWeight.normal,
        fontSize: t.fontSize.xsmall,
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

Caption2.propTypes = {
  children: PropTypes.node,
  muted: PropTypes.bool
}

Caption2.defaultProps = {
  children: null,
  muted: false
}

export default Caption2
