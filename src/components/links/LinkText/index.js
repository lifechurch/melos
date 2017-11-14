import React from 'react'
import PropTypes from 'prop-types'
import { withTheme } from 'glamorous'
import * as glamor from 'glamor'
import Link from '../Link'
import getThemeForComponent from '../../themes/utils/getThemeForComponent'
import shadeColor from '../../../utils/shadeColor'

function LinkText(props) {
  const { theme, children } = props
  const className = glamor.css(getThemeForComponent('LinkText', theme, props, (t) => {
    return {
      fontFamily: t.fontFamily.primary,
      fontSize: t.fontSize.small,
      lineHeight: t.lineHeight.medium,
      fontWeight: t.fontWeight.normal,
      textDecoration: 'none',
      color: t.color.primary,
      ':hover': {
        color: shadeColor(t.color.primary, -0.2)
      }
    }
  }))

  return (
    <Link className={`${className}`} {...props}>
      {children}
    </Link>
  )
}

LinkText.propTypes = {
  theme: PropTypes.object,
  children: PropTypes.node
}

LinkText.defaultProps = {
  theme: {},
  children: null
}

export default withTheme(LinkText)
