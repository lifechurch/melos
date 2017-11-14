import React, { Component } from 'react'

function withThirdPartyAuth(WrappedComponent) {
  class ThirdPartyAuth extends Component {
    constructor(props) {
      super(props)
      this.state = {
        errors: []
      }
    }

    loadExternalScript = (url, id) => {
      return new Promise((resolve) => {
        if (document.getElementById(id)) { return }

        const SCRIPT = 'script'
        const firstScriptTag = document.getElementsByTagName(SCRIPT)[0]
        const newScriptTag = document.createElement(SCRIPT)

        newScriptTag.id = id
        newScriptTag.src = url
        newScriptTag.async = true
        newScriptTag.defer = true

        newScriptTag.onload = () => { resolve() }

        firstScriptTag.parentNode.insertBefore(newScriptTag, firstScriptTag)
      })
    }

    reportError = (error) => {
      const errors = [ ...this.state.errors ]
      if (typeof error === 'string') {
        errors.push({ message: error })
      } else if (error && typeof error === 'object') {
        errors.push(error)
      }
      this.setState({ errors })
    }

    clearErrors = () => {
      this.setState({ errors: [] })
    }

    render() {
      const { errors } = this.state
      return (
        <WrappedComponent
          errors={errors}
          clearErrors={this.clearErrors}
          reportError={this.reportError}
          loadExternalScript={this.loadExternalScript}
          {...this.props}
        />
      )
    }
  }

  return ThirdPartyAuth
}

export default withThirdPartyAuth
