import React, { PropTypes } from 'react'
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
        display="flex"
        alignItems="center"
      >
        {left}
      </Div>
      <Div
        position="absolute"
        left="50%"
        top="50%"
        transform="translate(-50%,-50%)"
        display="flex"
        alignItems="center"
        width="max-content"
        margin="auto"
      >
        {children}
      </Div>
      <Div
        display="flex"
        alignItems="center"
        marginLeft="auto"
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
