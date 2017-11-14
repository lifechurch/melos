import React from 'react'
import PropTypes from 'prop-types'
import { Div } from 'glamorous'

function VerticalSpace(props) {
  const { space, children } = props

  const propsToPass = Object.assign({}, props)
  delete propsToPass.space
  delete propsToPass.children

  return (
    <Div
      {...propsToPass}
      display="flex"
      flexDirection="column"
      css={{
        '> *': {
          marginBottom: `${space}px !important`
        },
        '> :last-child': {
          marginBottom: '0 !important'
        }
      }}
    >
      {children}
    </Div>
  )
}

VerticalSpace.propTypes = {
  space: PropTypes.number,
  children: PropTypes.node
}

VerticalSpace.defaultProps = {
  space: 30,
  children: null
}

export default VerticalSpace
