import React from 'react'
import PropTypes from 'prop-types'
import { Div } from 'glamorous'

function Card({ className, children, mini }) {
  const padding = mini ? 12 : 32
  return (
    <Div
      background="white"
      boxShadow="0 2px 4px 0 rgba(0,0,0,0.1)"
      borderRadius={2}
      className={`${className}`}
      width={`calc(100% - ${padding * 2}px)`}
      padding={padding}
    >
      {children}
    </Div>
  )
}

Card.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  mini: PropTypes.bool
}

Card.defaultProps = {
  className: '',
  children: null,
  mini: false
}

export default Card
