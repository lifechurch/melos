import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import Helmet from 'react-helmet'

import Card from '../../../../components/Card'
import CheckMark from '../../../../components/CheckMark'
import XMark from '../../../../components/XMark'
import YouVersion from '../../../../components/YVLogo'

class UnsubscribeConfirmation extends Component {
  constructor(props) {
    super(props)
    this.state = { ready: false }
  }

  componentDidMount() {
    /* eslint-disable react/no-did-mount-set-state */
    const { type } = this.props
    this.setState({ ready: true })
    this.unsubscribe(type)
  }

  componentWillReceiveProps(nextProps) {
    const { type: nextType } = nextProps
    const { type } = this.props

    if (type !== nextType) {
      this.unsubscribe(nextType)
    }
  }

  getStatus = () => {
    const {
      status,
      lensStatus,
      bafkStatus,
      product
    } = this.props

    if (product === 'lens') return lensStatus
    else if (product === 'bafk') return bafkStatus
    else return status
  }

  getErrors = () => {
    const {
      errors,
      lensErrors,
      bafkErrors,
      product
    } = this.props

    if (product === 'lens') return lensErrors
    else if (product === 'bafk') return bafkErrors
    else return errors
  }

  unsubscribe = (type) => {
    const {
      loggedIn,
      token,
      data,
      unsubscribe
    } = this.props

    if (type && (token || loggedIn)) {
      unsubscribe({ type, token, data })
    }
  }

  render() {
    const {
      token,
      loggedIn,
      type,
      localizedLink,
      intl,
      plan,
      product,
      tokenIdentity: {
        languageTag
      }
    } = this.props

    const status = this.getStatus()
    const errors = this.getErrors()

    const { ready } = this.state

    let statusMark
    if (status === 'success') {
      statusMark = <CheckMark width={28} height={21} />
    } else if (status === 'loading') {
      statusMark = <CheckMark width={28} height={21} fill="#777" />
    } else {
      statusMark = <XMark width={21} height={21} fill="#F00" />
    }

    let statusText
    let tokenValid = !!token
    if (['success', 'loading'].indexOf(status) > -1) {
      const plan_title = (plan && typeof plan === 'object') ? (plan.name[languageTag] || plan.name.default) : ''
      statusText = <FormattedHTMLMessage id={`unsubscribe.success.${type}`} values={{ plan_title }} />
    } else {
      let errorType = 'other_type'
      errors.forEach((e) => {
        if (e.key === 'users.user_verification_token.invalid') {
          errorType = 'token'
          tokenValid = false
        }
      })
      statusText = <FormattedMessage id={`unsubscribe.error.${errorType}`} />
    }

    let logoSrc
    if (product === 'lens') {
      logoSrc = '/assets/BibleLens-icon-48x48.png'
    } else if (product === 'bafk') {
      logoSrc = '/assets/BibleAppForKids-icon-48x48.png'
    } else {
      logoSrc = '/assets/icons/bible/48/en.png'
    }

    return (
      <div className="yv-unsubscribe-confirmation">
        <Helmet title={intl.formatMessage({ id: 'unsubscribe.links.manage' })} />
        <div className="card-wrapper">
          <a href="/"><YouVersion height={21} width={150} /></a>
          <div className="product-container">
            <img alt="Bible Lens Icon" className="product-icon" src={logoSrc} />
          </div>
          <Card>
            {(loggedIn || token) && (
              <div className={status === 'loading' ? 'ghost' : ''}>
                {statusMark}
                <p>{statusText}</p>

                { (product !== 'lens' && product !== 'bafk') && (
                  <Link to={localizedLink(`/unsubscribe/manage${ready && tokenValid ? `?token=${token}` : ''}`, languageTag)} className="solid-button">
                    <FormattedMessage id="unsubscribe.links.manage" />
                  </Link>
                )}

                { (type !== 'all' && product !== 'lens' && product !== 'bafk') && (
                  <Link to={localizedLink(`/unsubscribe?type=all${ready && tokenValid ? `&token=${token}` : ''}`, languageTag)}>
                    <FormattedMessage id="unsubscribe.links.unsub all" />
                  </Link>
                )}

              </div>
            )}

            {(!loggedIn && !token) && (
              <div>
                <FormattedMessage id="unsubscribe.error.token" />
                <p className="yv-unsubscribe-manage-footer">
                  <a href={localizedLink(`/sign-in?redirect=${encodeURIComponent(`/unsubscribe?type=${type}&product=${product}`)}`, languageTag) }>
                    <FormattedMessage id="Auth.sign in" />
                  </a>
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    )
  }
}

UnsubscribeConfirmation.propTypes = {
  type: PropTypes.oneOf([
    'badges',
    'comments',
    'friendships',
    'likes',
    'moments',
    'newsletter',
    'pwf_accepts',
    'pwf_comments',
    'reading_plans',
    'rp_daily',
    'votd',
    'votd_image',
    'contact_joins',
    'all'
  ]),
  token: PropTypes.string,
  data: PropTypes.string,
  status: PropTypes.oneOf([ 'loading', 'success', 'other', 'error' ]),
  errors: PropTypes.array,
  lensStatus: PropTypes.oneOf([ 'loading', 'success', 'other', 'error' ]),
  lensErrors: PropTypes.array,
  bafkStatus: PropTypes.oneOf([ 'loading', 'success', 'other', 'error' ]),
  bafkErrors: PropTypes.array,
  loggedIn: PropTypes.bool,
  localizedLink: PropTypes.func.isRequired,
  unsubscribe: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  tokenIdentity: PropTypes.object,
  plan: PropTypes.object,
  product: PropTypes.object
}

UnsubscribeConfirmation.defaultProps = {
  type: null,
  token: null,
  data: null,
  status: 'loading',
  lensStatus: 'loading',
  bafkStatus: 'loading',
  loggedIn: false,
  errors: [],
  lensErrors: [],
  bafkErrors: [],
  tokenIdentity: {},
  plan: null,
  product: null
}

export default UnsubscribeConfirmation
