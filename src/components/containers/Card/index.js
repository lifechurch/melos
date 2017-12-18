import React from 'react'
import PropTypes from 'prop-types'
import { Div } from 'glamorous'

const CONSTANTS = {
  large: 25,
  medium: 12,
  none: 0,
}

function Card({ className, children, padding }) {
  const paddingNum = CONSTANTS[padding]
  return (
    <Div
      background="white"
      boxShadow="0 8px 18px 0 rgba(0,0,0,0.11)"
      borderRadius={4}
      className={className}
      padding={paddingNum}
    >
      {children}
    </Div>
  )
}

Card.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  padding: PropTypes.oneOf(['large', 'medium', 'none']),
}

Card.defaultProps = {
  className: '',
  children: null,
  padding: 'large',
}

export default Card
