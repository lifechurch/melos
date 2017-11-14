import React, { Component } from 'react'
import PropTypes from 'prop-types'
import withThirdPartyAuth from '../withThirdPartyAuth'

const FACEBOOK_API_URL = '//connect.facebook.net/en_US/sdk.js'
const FACEBOOK_SCRIPT_ID = 'facebook-jssdk'

function withFacebook(WrappedComponent) {
  class Facebook extends Component {
    constructor(props) {
      super(props)
      this.state = {
        buttonDisabled: true,
        token: null,
        id: null,
        status: null,
        name: null,
        avatarUrl: null,
        profileEmpty: true
      }
    }


    componentDidMount() {
      const { loadExternalScript, appId } = this.props

      window.fbAsyncInit = () => {
        this.FB = window.FB
        this.FB.init({
          appId,
          xfbml: true,
          version: 'v2.8'
        })

        setTimeout(() => {
          this.fbInit()
        }, 250)
      }

      if (typeof loadExternalScript === 'function') {
        loadExternalScript(FACEBOOK_API_URL, FACEBOOK_SCRIPT_ID)
      }
    }

    fbInit = () => {
      this.FB.getLoginStatus((response) => {
        const newState = {
          buttonDisabled: false,
          status: response.status
        }

        if (response.status === 'connected') {
          newState.token = response.authResponse.accessToken
          newState.id = response.authResponse.userID
          this.FB.api('/me', (meResponse) => {
            const { id, name } = meResponse

            this.setState(() => {
              return { name }
            })

            this.FB.api(`/${id}/picture?height=96&width=96`, (picResponse) => {
              const {
                data: {
                  url
                }
              } = picResponse

              this.setState(() => {
                return {
                  avatarUrl: url,
                  profileEmpty: false
                }
              })
            })
          })
        }

        this.setState(() => {
          return newState
        })
      });
    }

    handleStatusChange = (response) => {
      if (response.status === 'connected') {
        this.setState(() => {
          return {
            token: response.authResponse.accessToken,
            id: response.authResponse.userID
          }
        })
        this.submitToFB()
      }
    }

    handleLogin = () => {
      const { status } = this.state
      const { scope } = this.props
      if (status === 'connected') {
        this.submitToFB()
      } else if (status === 'not_authorized') {
        this.FB.login(this.handleStatusChange, { scope })
      } else {
        this.FB.login(this.handleStatusChange, { scope })
      }
    }

    submitToFB = () => {
      const { onLogin } = this.props
      const { token } = this.state

      if (typeof onLogin === 'function') {
        onLogin({ token })
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

  Facebook.propTypes = {
    loadExternalScript: PropTypes.func,
    onLogin: PropTypes.func,
    scope: PropTypes.string,
    appId: PropTypes.string
  }

  Facebook.defaultProps = {
    loadExternalScript: null,
    onLogin: null,
    scope: 'public_profile,email',
    appId: null
  }

  return withThirdPartyAuth(Facebook)
}

export default withFacebook
