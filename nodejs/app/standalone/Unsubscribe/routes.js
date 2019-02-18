import React from 'react'
import { Route, IndexRoute } from 'react-router'
import Unsubscribe from '../../containers/Unsubscribe'
import UnsubscribeConfirmation from '../../features/Notifications/components/UnsubscribeConfirmation/UnsubscribeConfirmation'
import ManageNotifications from '../../features/Notifications/components/ManageNotifications/ManageNotifications'

export default function () {
  return (
    <Route path="/(:lang/)unsubscribe" component={Unsubscribe}>
      <IndexRoute component={UnsubscribeConfirmation} />
      <Route path="manage" component={ManageNotifications} />
    </Route>
  )
}
