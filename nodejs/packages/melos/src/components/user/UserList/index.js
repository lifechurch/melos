import React from 'react'
import PropTypes from 'prop-types'
import List from '../List'

function UserList({ users, children }) {
  if (typeof children !== 'function' || !Array.isArray(users)) return null
  return (
    <List />
  )
}

UserList.propTypes = {
  children: PropTypes.func
}

UserList.defaultProps = {
  children: null
}

export default UserList
