import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import Immutable from 'immutable'
import { connect } from 'react-redux'
import cookie from 'react-cookie'
import GoogleAuth from '@youversion/utils/lib/auth/googleAuth'
import streaksAction from '@youversion/api-redux/lib/endpoints/streaks/action'
import { getConfiguration } from '@youversion/api-redux/lib/endpoints/bible/reducer'
import localOnceDaily from '@youversion/utils/lib/localOnceDaily'
import ResponsiveContainer from '../../../components/ResponsiveContainer'
import FooterContent from './FooterContent'
import LangSelector from './LangSelector'
import LinkCard from './LinkCard'
import FullscreenDrawer from '../../../components/FullscreenDrawer'


class Footer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      linksOpen: false,
      langSelectorOpen: false
    }
  }

  componentDidMount() {
    const { dispatch, auth } = this.props
    const immAuth = Immutable.fromJS(auth)
    const userIdKeyPath = [ 'userData', 'userid' ]

    if (immAuth.hasIn(userIdKeyPath)) {
      // setup google auth for monitoring google token if signed in with google
      if (cookie.load('auth_type') === 'google') {
        window.yvga = new GoogleAuth({
          client_id: '201895780642-g4oj7hm4p3h81eg7b1di2l2l93k5gcm3.apps.googleusercontent.com',
        })
        window.yvga.init()
      }
      const userId = immAuth.getIn(userIdKeyPath)
      localOnceDaily(`DailyStreakCheckin-${userId}`, (handleSuccess) => {
        const today = moment()

        // Streaks Checkin
        dispatch(streaksAction({
          method: 'checkin',
          params: {
            user_id: userId,
            day_of_year: today.dayOfYear(),
            year: today.year()
          }
        })).then((response) => {
          if ('current_streak' in response && typeof handleSuccess === 'function') {
            handleSuccess()

            // Google Analytics Event
            if (window.location.hostname === 'www.bible.com') {
              ga.event({
                category: 'User',
                action: 'StreaksCheckin',
                value: parseInt(response.current_streak.toString(), 10)
              })
            }
          }
        })
      })
    }
  }

  handleLangClose = () => {
    this.setState({ langSelectorOpen: false })
  }

  handleLinksClose = () => {
    this.setState({ linksOpen: false })
  }

  handleLangClick = () => {
    this.setState((state) => {
      return { langSelectorOpen: !state.langSelectorOpen }
    })
  }

  handleLinksClick = () => {
    this.setState((state) => {
      return { linksOpen: !state.linksOpen }
    })
  }

  render() {
    const {
      serverLanguageTag,
      bibleConfiguration
    } = this.props

    const {
      langSelectorOpen,
      linksOpen
    } = this.state

    const {
      response: {
        totals: {
          versions,
          languages
        }
      }
    } = bibleConfiguration

    return (
      <ResponsiveContainer className='footer-container'>
        <FooterContent
          {...this.props}
          onLangClose={this.handleLangClose}
          onLinksClose={this.handleLinksClose}
          onLangClick={this.handleLangClick}
          onLinksClick={this.handleLinksClick}
          langSelectorOpen={langSelectorOpen}
          linksOpen={linksOpen}
          versions={versions}
          languages={languages}
        />
        <FullscreenDrawer
          isOpen={langSelectorOpen}
          onClose={this.handleLangClose}
        >
          <LangSelector {...this.props} />
        </FullscreenDrawer>
        <FullscreenDrawer
          isOpen={linksOpen}
          onClose={this.handleLinksClose}
        >
          <LinkCard
            serverLanguageTag={serverLanguageTag}
            versions={versions}
            languages={languages}
          />
        </FullscreenDrawer>
      </ResponsiveContainer>
    )
  }
}

Footer.propTypes = {
  serverLanguageTag: PropTypes.string,
  bibleConfiguration: PropTypes.object,
  auth: PropTypes.object,
  dispatch: PropTypes.func.isRequired
}

Footer.defaultProps = {
  serverLanguageTag: 'en',
  bibleConfiguration: {},
  auth: {},
  locale: {}
}

function mapStateToProps(state) {
  return {
    bibleConfiguration: getConfiguration(state),
    serverLanguageTag: state.serverLanguageTag,
    auth: state.auth,
    locale: state.locale
  }
}

export default connect(mapStateToProps, null)(Footer)
