import React from 'react'
import PropTypes from 'prop-types'
import { Div } from 'glamorous'
import { smallOnly, mediumUp } from '../../../utils/mediaQueries'

function VerticalSpace(props) {
  const { space, children, columns } = props

  const propsToPass = Object.assign({}, props)
  delete propsToPass.space
  delete propsToPass.children
  delete propsToPass.columns

  const columnWidth = `calc(${100 / columns}% - ${((columns - 1) * space) / columns}px)`

  const colsOnLastRow = React.Children.count(children) % columns || columns

  return (
    <Div
      {...propsToPass}
      display="flex"
      flexWrap="wrap"
      css={{
        [mediumUp]: {
          display: 'flex',
          flexWrap: 'wrap',
          '> *': {
            marginBottom: `${space}px !important`,
            marginLeft: `${space / 2}px`,
            marginRight: `${space / 2}px`,
            width: `${columnWidth}`
          },
          [`> :nth-child(${columns}n)`]: {
            marginRight: 0
          },
          [`> :nth-child(${columns}n+1)`]: {
            marginLeft: 0
          },
          [`> :nth-last-child(-n+${colsOnLastRow})`]: {
            marginBottom: 0
          }
        },
        [smallOnly]: {
          display: 'block',
          '> *': {
            marginBottom: `${space}px !important`
          },
          '> :last-child': {
            marginBottom: 0
          }
        }
      }}
    >
      {children}
    </Div>
  )
}

VerticalSpace.propTypes = {
  space: PropTypes.number,
  columns: PropTypes.number,
  children: PropTypes.node
}

VerticalSpace.defaultProps = {
  space: 30,
  columns: 1,
  children: null
}

export default VerticalSpace
