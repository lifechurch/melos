import React from 'react'
import PropTypes from 'prop-types'
import { Div } from 'glamorous'
import { mediumUp, smallOnly } from '../../../utils/mediaQueries'

function Padded({ className, children }) {

  return (
    <Div
      className={`${className}`}
      width="fill-available"
      css={{
        [mediumUp]: {
          padding: '0 32px'
        },
        [smallOnly]: {
          padding: '0 20px'
        }
      }}
    >
      {children}
    </Div>
  )
}

Padded.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
}

Padded.defaultProps = {
  className: '',
  children: null
}

export default Padded
