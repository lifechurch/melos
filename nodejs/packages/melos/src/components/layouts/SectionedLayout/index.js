import React from 'react'
import PropTypes from 'prop-types'
import { Div } from 'glamorous'

function SectionedLayout({ className, style, left, right, children }) {
  return (
    <Div
      display="flex"
      position="relative"
      alignItems="center"
      width="100%"
      minHeight={30}
      className={className}
      style={style}
    >
      <Div
        position="absolute"
        left="0"
        display="flex"
        alignItems="center"
      >
        {left}
      </Div>
      <Div
        display="flex"
        alignItems="center"
        width={(left || right) ? '80%' : '100%'}
        margin="auto"
      >
        {children}
      </Div>
      <Div
        position="absolute"
        right="0"
        display="flex"
        alignItems="center"
      >
        {right}
      </Div>
    </Div>
  )
}

SectionedLayout.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  left: PropTypes.node,
  right: PropTypes.node,
  children: PropTypes.node
}

SectionedLayout.defaultProps = {
  className: '',
  style: null,
  left: null,
  right: null,
  children: null
}

export default SectionedLayout
