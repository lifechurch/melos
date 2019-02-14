/* global Raven */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import Notifications from '@youversion/api-redux/lib/endpoints/notifications/action'
import Users from '@youversion/api-redux/lib/endpoints/users/action'
import ReadingPlans from '@youversion/api-redux/lib/endpoints/readingPlans/action'
import { unsubscribeStatus, unsubscribeErrors, isLoggedIn, getNotificationSettings, getVOTDSubscription } from '@youversion/api-redux/lib/endpoints/notifications/reducer'
import LensSettings, { unsubscribeStatus as lensUnsubscribeStatus, unsubscribeErrors as lensUnsubscribeErrors } from '@youversion/api-redux/lib/endpoints/lens-settings'
import Bafk, { unsubscribeStatus as bafkUnsubscribeStatus, unsubscribeErrors as bafkUnsubscribeErrors } from '@youversion/api-redux/lib/endpoints/bafk'
import { getTokenIdentity, getLoggedInUser } from '@youversion/api-redux/lib/endpoints/users/reducer'
import { getMyPlans, getPlanById } from '@youversion/api-redux/lib/endpoints/readingPlans/reducer'
import moment from 'moment'

import localizedLink from '@youversion/utils/lib/routes/localizedLink'

function hasError(response) {
  return ('errors' in response && response.errors.length > 0)
}

function reportError(key) {
  if (typeof Raven !== 'undefined') {
    Raven.captureException(new Error(key))
  }
}

class Unsubscribe extends Component {
  componentDidMount() {
    const {
      loggedInUser,
      location: {
        query: {
          token
        }
      }
    } = this.props

    this.getUser(token)

    if ('userid' in loggedInUser) {
      this.getPlans(loggedInUser.userid)
    }
  }

  getUser = (token) => {
    const { dispatch } = this.props

    const promise = dispatch(Users({
      method: 'token_identity',
      params: { token },
      extras: {},
      auth: !token
    }))

    promise.then((d) => {
      if (hasError(d)) {
        reportError(d.errors[0].key)
      }
    })

    return promise
  }

  getPlans = (user_id) => {
    const { dispatch } = this.props

    dispatch(ReadingPlans({
      method: 'items',
      params: { user_id },
      extras: {},
      auth: true
    })).then((d) => {
      if (hasError(d)) {
        reportError(d.errors[0].key)
      }
    })
  }

  getPlan = (id) => {
    const { dispatch } = this.props

    dispatch(ReadingPlans({
      method: 'view',
      params: { id },
      extras: {}
    })).then((d) => {
      if (hasError(d)) {
        reportError(d.errors[0].key)
      }
    })
  }

  getNotificationSettings = (token) => {
    const { dispatch } = this.props

    dispatch(Notifications({
      method: 'settings',
      params: { token },
      extras: {},
      auth: !token
    })).then((d) => {
      if (hasError(d)) {
        reportError(d.errors[0].key)
      }
    })
  }

  getVOTDSubscription = (token) => {
    const { dispatch } = this.props

    dispatch(Notifications({
      method: 'votd_subscription',
      params: { token },
      extras: {},
      auth: !token
    })).then((d) => {
      if (hasError(d)) {
        // This is an expected error if the user is not subscribed to VOTD
        if (d.errors[0].key !== 'notifications.votd_subscription.not_found') {
          reportError(d.errors[0].key)
        }
      }
    })
  }

  unsubscribe = ({ type, token, data }) => {
    const {
      location: {
        query: {
          product // which product does this link point to: Bible App, Lens, BAFK ?
        }
      }
    } = this.props

    if (product === 'lens') return this.unsubscribeLens({ token })
    if (product === 'bafk') return this.unsubscribeBafk({ token })

    return new Promise((resolve, reject) => {
      const { dispatch } = this.props

      dispatch(Notifications({
        method: 'unsubscribe',
        params: { token, type, data },
        extras: {},
        auth: !token
      })).then((d) => {
        if (hasError(d)) {
          reportError(d.errors[0].key)
          reject()
        } else if (type === 'rp_daily') {
          this.getPlan(data)
          resolve()
        } else {
          resolve()
        }
      }, () => {
        reject()
      })
    })
  }

  unsubscribeLens = ({ token }) => {
    return new Promise((resolve, reject) => {
      const { dispatch } = this.props
      dispatch(LensSettings.actions.unsubscribe.put({
        token
      }, {
        body: {
          updated_dt: moment().utc().format()
        },
        auth: !token,
      })).then((d) => {
        if (hasError(d)) {
          reportError(d.errors[0].key)
          reject()
        } else {
          resolve()
        }
      }, () => {
        reject()
      })
    })
  }

  unsubscribeBafk = ({ token }) => {
    return new Promise((resolve, reject) => {
      const { dispatch } = this.props
      dispatch(Bafk.actions.unsubscribe.put({
        token
      }, {
        body: {
          updated_dt: moment().utc().format()
        },
        auth: !token,
      })).then((d) => {
        if (hasError(d)) {
          reportError(d.errors[0].key)
          reject()
        } else {
          resolve()
        }
      }, () => {
        reject()
      })
    })
  }

  updateNotificationSettings = ({ token, settings }) => {
    return new Promise((resolve, reject) => {
      const { dispatch } = this.props
      dispatch(Notifications({
        method: 'update_settings',
        params: { token, notification_settings: settings },
        extras: {},
        auth: !token
      })).then((d) => {
        if (hasError(d)) {
          reportError(d.errors[0].key)
          reject()
        } else {
          resolve()
        }
      }, () => {
        reject()
      })
    })
  }

  updateVOTDSubscription = ({ token, subscription }) => {
    return new Promise((resolve, reject) => {
      const { dispatch } = this.props
      dispatch(Notifications({
        method: 'update_votd_subscription',
        params: { token, ...subscription },
        extras: {},
        auth: !token
      })).then((d) => {
        if (hasError(d)) {
          reportError(d.errors[0].key)
          reject()
        } else {
          resolve()
        }
      }, () => {
        reject()
      })
    })
  }

  render() {
    const {
      children,
      status,
      lensStatus,
      bafkStatus,
      loggedIn,
      errors,
      lensErrors,
      bafkErrors,
      hosts,
      tokenIdentity,
      notificationSettings,
      votdSubscription,
      myPlans,
      plan,
      intl,
      location: {
        query: {
          token,
          type,
          data,
          product // which product does this link point to: Bible App, Lens, BAFK ?
        }
      }
    } = this.props

    return (
      <div className="yv-unsubscribe">
        {
          children
          && (children.length > 0 || !Array.isArray(children))
          && React.cloneElement(children, {
            status,
            lensStatus,
            bafkStatus,
            loggedIn,
            token,
            type,
            data,
            product,
            localizedLink,
            errors,
            lensErrors,
            bafkErrors,
            hosts,
            tokenIdentity,
            notificationSettings,
            votdSubscription,
            myPlans,
            plan,
            intl,
            getNotificationSettings: this.getNotificationSettings,
            getVOTDSubscription: this.getVOTDSubscription,
            unsubscribe: this.unsubscribe,
            updateNotificationSettings: this.updateNotificationSettings,
            updateVOTDSubscription: this.updateVOTDSubscription
          })
        }
      </div>
    )
  }
}

Unsubscribe.propTypes = {
  children: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  hosts: PropTypes.object,
  status: PropTypes.oneOf([ 'loading', 'success', 'other', 'error' ]),
  lensStatus: PropTypes.oneOf([ 'loading', 'success', 'other', 'error' ]),
  bafkStatus: PropTypes.oneOf([ 'loading', 'success', 'other', 'error' ]),
  errors: PropTypes.array,
  lensErrors: PropTypes.array,
  bafkErrors: PropTypes.array,
  loggedIn: PropTypes.bool,
  tokenIdentity: PropTypes.object,
  loggedInUser: PropTypes.object,
  myPlans: PropTypes.object,
  notificationSettings: PropTypes.object,
  votdSubscription: PropTypes.object,
  plan: PropTypes.object,
  intl: PropTypes.object.isRequired
}

Unsubscribe.defaultProps = {
  status: 'loading',
  lensStatus: 'loading',
  bafkStatus: 'loading',
  loggedIn: false,
  hosts: {},
  errors: [],
  lensErrors: [],
  bafkErrors: [],
  tokenIdentity: {},
  loggedInUser: null,
  myPlans: {},
  notificationSettings: {},
  votdSubscription: {},
  plan: null
}

function mapStateToProps(state, props) {
  const {
    location: {
      query: {
        data: planId
      }
    }
  } = props

  return {
    status: unsubscribeStatus(state),
    errors: unsubscribeErrors(state),
    lensStatus: lensUnsubscribeStatus(state),
    lensErrors: lensUnsubscribeErrors(state),
    bafkStatus: bafkUnsubscribeStatus(state),
    bafkErrors: bafkUnsubscribeErrors(state),
    loggedIn: isLoggedIn(state),
    hosts: state.hosts,
    tokenIdentity: getTokenIdentity(state),
    loggedInUser: getLoggedInUser(state),
    myPlans: getMyPlans(state),
    plan: planId ? getPlanById(state, planId) : null,
    notificationSettings: getNotificationSettings(state),
    votdSubscription: getVOTDSubscription(state)
  }
}

export default connect(mapStateToProps, null)(injectIntl(Unsubscribe))
