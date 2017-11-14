import React, { Component, PropTypes } from 'react'
import withThirdPartyAuth from '../withThirdPartyAuth'

const GOOGLE_API_URL = '//apis.google.com/js/platform.js'
const GOOGLE_SCRIPT_ID = 'google-jssdk'

function withGoogle(WrappedComponent) {
  class Google extends Component {
    constructor(props) {
      super(props)
      this.state = {
        token: null,
        id: null,
        givenName: null,
        familyName: null,
        isSignedIn: false,
        avatarUrl: null,
        email: null,
        ready: false
      }

      this.gapi = null
      this.auth2 = null
    }

    componentDidMount() {
      const { loadExternalScript } = this.props

      if (typeof loadExternalScript === 'function') {
        loadExternalScript(GOOGLE_API_URL, GOOGLE_SCRIPT_ID).then(this.initializeAuthLibrary)
      }
    }

    initializeAuthLibrary = () => {
      const { clientId, scope } = this.props

      this.gapi = window.gapi

      this.gapi.load('auth2', () => {

        // Initialize GAPI Auth2 Library
        this.auth2 = this.gapi.auth2.init({
          client_id: clientId,
          cookiepolicy: 'single_host_origin',
          scope
        }).then((googleAuth) => {
          this.googleAuth = googleAuth
          this.setState({ ready: true })

          // Listen for changes to signed in state
          this.googleAuth.isSignedIn.listen((isSignedIn) => {
            this.setState({ isSignedIn })
          })

          // Listen for changes to signed in user
          this.googleAuth.currentUser.listen((googleUser) => {
            if (googleUser.isSignedIn() === true) {
              const profile = googleUser.getBasicProfile()
              this.setState({
                token: googleUser.getAuthResponse().id_token,
                id: profile.getId(),
                givenName: profile.getGivenName(),
                familyName: profile.getFamilyName(),
                avatarUrl: profile.getImageUrl(),
                email: profile.getEmail()
              })
            }
          })

          // If already signed in, get user silently
          // if (this.googleAuth.isSignedIn.get() === true) {
          //   this.googleAuth.signIn()
          // }
        })
      })
    }

    handleLogin = () => {
      const { onLogin, reportError } = this.props
      const { token } = this.state

      if (typeof onLogin === 'function') {
        if (token === null || typeof token === 'undefined' || token.length === 0) {
          this.googleAuth.signIn().then((googleUser) => {
            if (googleUser && typeof googleUser === 'object') {
              const authResponse = googleUser.getAuthResponse()
              if (authResponse && typeof authResponse === 'object') {
                onLogin({ token: authResponse.id_token })
              } else {
                reportError('Unable to sign in with Google.')
              }
            } else {
              reportError('Unable to sign in with Google.')
            }
          }, (error) => {
            reportError(error)
          })
        } else {
          onLogin({ token })
        }
      }
    }

    render() {
      return (
        <WrappedComponent
          {...this.state}
          {...this.props}
          onLogin={this.handleLogin}
        />
      )
    }
  }

  Google.propTypes = {
    clientId: PropTypes.string.isRequired,
    scope: PropTypes.string,
    onLogin: PropTypes.func,
    loadExternalScript: PropTypes.func,
    reportError: PropTypes.func
  }

  Google.defaultProps = {
    scope: 'profile email',
    onLogin: null,
    loadExternalScript: null,
    reportError: null
  }

  return withThirdPartyAuth(Google)
}

export default withGoogle
