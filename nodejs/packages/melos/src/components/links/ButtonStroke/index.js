import React from 'react'
import PropTypes from 'prop-types'
import * as glamor from 'glamor'
import { withTheme } from 'glamorous'
import shadeColor from '@youversion/utils/lib/shadeColor'
import SectionedLayout from '../../layouts/SectionedLayout'
import Link from '../Link'
import getThemeForComponent from '../../themes/utils/getThemeForComponent'

function ButtonStroke(props) {
  const { left, right, theme, children, color, textColor } = props

  const className = glamor.css(getThemeForComponent('ButtonStroke', theme, props, (t) => {
    return {
      fontFamily: t.fontFamily.primary,
      fontSize: t.fontSize.default,
      lineHeight: t.lineHeight.medium,
      fontWeight: t.fontWeight.normal,
      backgroundColor: color || t.color.primary,
      color: textColor || t.color.light,
      borderRadius: t.radius.medium,
      textAlign: 'center',
      padding: '3px 15px',
      cursor: 'pointer',
      border: t.border.thin,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ':hover': {
        backgroundColor: shadeColor(color || t.color.primary, -0.35),
        color: 'white',
      }
    }
  }))

  return (
    <Link className={className} {...props}>
      <SectionedLayout left={left || null} right={right || null}>
        {children}
      </SectionedLayout>
    </Link>
  )
}

ButtonStroke.propTypes = {
  color: PropTypes.string,
  textColor: PropTypes.string,
  left: PropTypes.node,
  right: PropTypes.node,
  theme: PropTypes.object,
  children: PropTypes.node
}

ButtonStroke.defaultProps = {
  color: null,
  textColor: null,
  left: null,
  right: null,
  theme: {},
  children: null
}

export default withTheme(ButtonStroke)
