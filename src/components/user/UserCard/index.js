import React from 'react'
import Card from '../../containers/Card'
import User from '../User'

function UserCard(props) {
  const { mini } = props
  return (
    <Card className="yv-user-card" mini={mini}>
      <User {...props} />
    </Card>
  )
}

UserCard.propTypes = User.propTypes

UserCard.defaultProps = User.defaultProps

export default UserCard
