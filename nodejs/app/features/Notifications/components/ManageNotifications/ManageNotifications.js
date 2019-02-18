import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Immutable from 'immutable'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import Helmet from 'react-helmet'

import Card from '../../../../components/Card'
import AsyncCheck from '../../../../components/AsyncCheck/AsyncCheck'
import YouVersion from '../../../../components/YVLogo'

function getTypeStatus(status) {
  const defaultValue = false
  return status ? status.email || defaultValue : defaultValue
}

class ManageNotifications extends Component {
  componentDidMount() {
    const {
      loggedIn,
      token,
      getNotificationSettings,
      getVOTDSubscription
    } = this.props

    if (token || loggedIn) {
      if (typeof getNotificationSettings === 'function') {
        getNotificationSettings(token)
      }

      if (typeof getVOTDSubscription === 'function') {
        getVOTDSubscription(token)
      }
    }
  }

  handleChange = ({ checked, data }) => {
    const {
      token,
      updateVOTDSubscription,
      updateNotificationSettings,
      votdSubscription,
      unsubscribe
    } = this.props
    const { type, plan } = data

    if (['votd', 'votd_image'].indexOf(type) > -1) {
      let subscription = Immutable.fromJS(votdSubscription)
      if (type === 'votd') {
        subscription = subscription.mergeDeep({ email: { time: null, version_id: null } }).toJS()
      } else if (type === 'votd_image') {
        subscription = subscription.mergeDeep({ image_email: { time: null, language_tag: null } }).toJS()
      }
      return updateVOTDSubscription({ type, token, subscription })
    } else if (type === 'rp_daily' && 'id' in plan) {
      return unsubscribe({ type, token, data: plan.id })
    } else {
      const settings = { [type]: { email: checked } }
      return updateNotificationSettings({ type, token, settings })
    }
  }

  render() {
    const {
      loggedIn,
      localizedLink,
      votdSubscription,
      myPlans,
      intl,
      notificationSettings: {
        friendships: friendshipsStatus,
        moments: momentsStatus,
        comments: commentsStatus,
        likes: likesStatus,
        newsletter: newsletterStatus,
        badges: badgesStatus,
        reading_plans: readingPlansStatus,
        contact_joins: contactJoinsStatus,
        pwf_comments: pwfCommentsStatus,
        pwf_accepts: pwfAcceptsStatus,
        pwf_invites: pwfInvitesStatus,
        pwf_reminders: pwfRemindersStatus
      },
      tokenIdentity: {
        email,
        loading,
        languageTag
      }
    } = this.props

    let votdStatus = false
    if (Immutable.fromJS(votdSubscription).hasIn(['email', 'version_id'])) {
      votdStatus = (typeof votdSubscription.email.version_id !== 'undefined') && (votdSubscription.email.version_id !== null)
    }

    let votdImageStatus = false
    if (Immutable.fromJS(votdSubscription).hasIn(['image_email', 'time'])) {
      votdImageStatus = (typeof votdSubscription.image_email.time !== 'undefined') && (votdSubscription.image_email.time !== null)
    }

    let emailDeliveryPlans = null
    let hasEmailPlans = false
    if (loggedIn && 'reading_plans' in myPlans && Array.isArray(myPlans.reading_plans)) {
      emailDeliveryPlans = myPlans.reading_plans.map((plan) => {
        if (plan.email_delivery !== null) {
          hasEmailPlans = true
          return (
            <AsyncCheck
              key={plan.id}
              initialValue={true}
              data={{ type: 'rp_daily', plan }}
              onChange={this.handleChange}
              label={plan.name.default}
              image={plan.images[2]}
              successMessage={false}
            />
          )
        }
        return null
      })
    }

    return (
      <div className="yv-unsubscribe-manage">
        <Helmet title={intl.formatMessage({ id: 'unsubscribe.links.manage' })} />
        <div className="card-wrapper">
          <a href={localizedLink('/', languageTag)}><YouVersion height={21} width={150} /></a>
          <Card>
            <div className={`content-wrapper ${loading ? 'ghost' : 'no-ghost'}`}>
              <h1><FormattedMessage id="unsubscribe.links.manage" /></h1>
              <p><FormattedMessage id="unsubscribe.about" /></p>
              {email || loading || typeof loading === 'undefined'
                ? <p className="user">
                  <b><FormattedMessage id="unsubscribe.email" />:</b> {email}
                  <a className="not-me" href={localizedLink('/sign-in?redirect=/unsubscribe/manage', languageTag)}><FormattedMessage id="unsubscribe.not me" /></a>
                </p>
                : <p className="user error">
                  <FormattedMessage id="unsubscribe.error.token" />
                  <br /><br />
                  <a className="centered-link" href={localizedLink('/sign-in?redirect=/unsubscribe/manage', languageTag)}><FormattedHTMLMessage id="Auth.sign in" /></a>
                </p>
              }
              <hr />
              <h3 className="tracked ttu f6 silver mb3"><FormattedMessage id="votd" /></h3>
              <AsyncCheck
                initialValue={votdStatus}
                data={{ type: 'votd' }}
                onChange={this.handleChange}
                enabled={!!email && votdStatus}
                offOnly={true}
                label={<FormattedMessage id="unsubscribe.labels.votd" />}
              />
              <AsyncCheck
                initialValue={votdImageStatus}
                data={{ type: 'votd_image' }}
                onChange={this.handleChange}
                enabled={!!email && votdImageStatus}
                offOnly={true}
                label={<FormattedMessage id="unsubscribe.labels.votd_image" />}
              />
              <hr />
              <h3 className="tracked ttu f6 silver mb3"><FormattedMessage id="unsubscribe.labels.moments" /></h3>
              <AsyncCheck
                initialValue={getTypeStatus(friendshipsStatus)}
                data={{ type: 'friendships' }}
                onChange={this.handleChange}
                enabled={!!email}
                label={<FormattedMessage id="unsubscribe.labels.friendships" />}
              />
              <AsyncCheck
                initialValue={getTypeStatus(momentsStatus)}
                data={{ type: 'moments' }}
                onChange={this.handleChange}
                enabled={!!email}
                label={<FormattedMessage id="unsubscribe.labels.moments" />}
              />
              <AsyncCheck
                initialValue={getTypeStatus(commentsStatus)}
                data={{ type: 'comments' }}
                onChange={this.handleChange}
                enabled={!!email}
                label={<FormattedMessage id="unsubscribe.labels.comments" />}
              />
              <AsyncCheck
                initialValue={getTypeStatus(likesStatus)}
                data={{ type: 'likes' }}
                onChange={this.handleChange}
                enabled={!!email}
                label={<FormattedMessage id="unsubscribe.labels.likes" />}
              />
              <AsyncCheck
                initialValue={getTypeStatus(contactJoinsStatus)}
                data={{ type: 'contact_joins' }}
                onChange={this.handleChange}
                enabled={!!email}
                label={<FormattedMessage id="unsubscribe.labels.contact_joins" />}
              />
              <hr />
              <h3 className="tracked ttu f6 silver mb3"><FormattedMessage id="unsubscribe.other" /></h3>
              <AsyncCheck
                initialValue={getTypeStatus(newsletterStatus)}
                data={{ type: 'newsletter' }}
                onChange={this.handleChange}
                enabled={!!email}
                label={<FormattedMessage id="unsubscribe.labels.newsletter" />}
              />
              <AsyncCheck
                initialValue={getTypeStatus(badgesStatus)}
                data={{ type: 'badges' }}
                onChange={this.handleChange}
                enabled={!!email}
                label={<FormattedMessage id="unsubscribe.labels.badges" />}
              />
              <AsyncCheck
                initialValue={getTypeStatus(readingPlansStatus)}
                data={{ type: 'reading_plans' }}
                onChange={this.handleChange}
                enabled={!!email}
                label={<FormattedMessage id="unsubscribe.labels.reading_plans" />}
              />
              <hr />
              <h3 className="tracked ttu f6 silver mb3"><FormattedMessage id="unsubscribe.pwf" /></h3>
              <AsyncCheck
                initialValue={getTypeStatus(pwfCommentsStatus)}
                data={{ type: 'pwf_comments' }}
                onChange={this.handleChange}
                enabled={!!email}
                label={<FormattedMessage id="unsubscribe.labels.pwf_comments" />}
              />
              <AsyncCheck
                initialValue={getTypeStatus(pwfAcceptsStatus)}
                data={{ type: 'pwf_accepts' }}
                onChange={this.handleChange}
                enabled={!!email}
                label={<FormattedMessage id="unsubscribe.labels.pwf_accepts" />}
              />
              <AsyncCheck
                initialValue={getTypeStatus(pwfInvitesStatus)}
                data={{ type: 'pwf_invites' }}
                onChange={this.handleChange}
                enabled={!!email}
                label={<FormattedMessage id="unsubscribe.labels.pwf_invites" />}
              />
              <AsyncCheck
                initialValue={getTypeStatus(pwfRemindersStatus)}
                data={{ type: 'pwf_reminders' }}
                onChange={this.handleChange}
                enabled={!!email}
                label={<FormattedMessage id="unsubscribe.labels.pwf_reminders" />}
              />
              {hasEmailPlans ? <hr /> : null }
              {hasEmailPlans ? <h3 className="tracked ttu f6 silver mb3"><FormattedMessage id="unsubscribe.plan delivery" /></h3> : null }
              {hasEmailPlans ? <span>{ emailDeliveryPlans }</span> : null }

            </div>
          </Card>
          {!loggedIn && <p className="yv-unsubscribe-manage-footer"><FormattedHTMLMessage id="unsubscribe.sign-in" values={{ sign_in_path: localizedLink('/sign-in?redirect=/unsubscribe/manage', languageTag) }} /></p>}
        </div>
      </div>
    )
  }
}

ManageNotifications.propTypes = {
  token: PropTypes.string,
  loggedIn: PropTypes.bool,
  localizedLink: PropTypes.func.isRequired,
  tokenIdentity: PropTypes.object,
  myPlans: PropTypes.object,
  getNotificationSettings: PropTypes.func,
  getVOTDSubscription: PropTypes.func,
  updateNotificationSettings: PropTypes.func,
  updateVOTDSubscription: PropTypes.func,
  votdSubscription: PropTypes.object,
  unsubscribe: PropTypes.func,
  notificationSettings: PropTypes.object,
  intl: PropTypes.object.isRequired
}

ManageNotifications.defaultProps = {
  token: null,
  loggedIn: false,
  tokenIdentity: {},
  myPlans: null,
  getNotificationSettings: null,
  getVOTDSubscription: null,
  updateNotificationSettings: null,
  updateVOTDSubscription: null,
  votdSubscription: null,
  unsubscribe: null,
  notificationSettings: null
}

export default ManageNotifications
