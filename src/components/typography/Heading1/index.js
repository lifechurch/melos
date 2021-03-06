import React from 'react'
import PropTypes from 'prop-types'
import glamorous from 'glamorous'
import getThemeForComponent from '../../themes/utils/getThemeForComponent'

function Heading1(props) {
  const { children, muted, textAlign } = props
  const ThemedElement = glamorous.h1({}, ({ theme }) => {
    return getThemeForComponent('Heading1', theme, props, (t) => {
      return {
        fontFamily: t.fontFamily.primary,
        fontWeight: t.fontWeight.bold,
        fontSize: t.fontSize.xlarge,
        textAlign,
        width: '100%',
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

Heading1.propTypes = {
  children: PropTypes.node,
  muted: PropTypes.bool,
  textAlign: PropTypes.string,
}

Heading1.defaultProps = {
  children: null,
  muted: false,
  textAlign: 'center'
}

export default Heading1
