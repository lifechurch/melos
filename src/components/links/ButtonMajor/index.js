import React from 'react'
import PropTypes from 'prop-types'
import * as glamor from 'glamor'
import { withTheme } from 'glamorous'
import SectionedLayout from '../../layouts/SectionedLayout'
import Link from '../Link'
import getThemeForComponent from '../../themes/utils/getThemeForComponent'
import shadeColor from '../../../utils/shadeColor'

function ButtonMajor(props) {
  const { left, right, theme, children, color, textColor } = props

  const className = glamor.css(getThemeForComponent('ButtonMajor', theme, props, (t) => {
    return {
      fontFamily: t.fontFamily.primary,
      fontSize: t.fontSize.medium,
      lineHeight: t.lineHeight.medium,
      fontWeight: t.fontWeight.bold,
      backgroundColor: color || t.color.primary,
      color: textColor || t.color.light,
      borderRadius: t.radius.medium,
      textAlign: 'center',
      padding: t.padding.medium,
      cursor: 'pointer',
      border: t.border.thin,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ':hover': {
        backgroundColor: shadeColor(color || t.color.primary, -0.2)
      }
    }
  }))

  return (
    <Link className={`${className}`} {...props}>
      <SectionedLayout left={left || null} right={right || null}>
        {children}
      </SectionedLayout>
    </Link>
  )
}

ButtonMajor.propTypes = {
  color: PropTypes.string,
  textColor: PropTypes.string,
  left: PropTypes.node,
  right: PropTypes.node,
  theme: PropTypes.object,
  children: PropTypes.node
}

ButtonMajor.defaultProps = {
  color: null,
  textColor: null,
  left: null,
  right: null,
  theme: {},
  children: null
}

export default withTheme(ButtonMajor)
