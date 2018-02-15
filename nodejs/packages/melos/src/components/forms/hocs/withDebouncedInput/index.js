import React, { Component } from 'react'
import PropTypes from 'prop-types'

const DEBOUNCE_TIMEOUT = 300

function withDebouncedInput(WrappedComponent) {
  class DebouncedInput extends Component {
    constructor(props) {
      super(props)
      this.state = {
        stateValue: props.value,
        changeEvent: {}
      }
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.value !== this.props.value) {
        this.setState({ stateValue: nextProps.value })
      }
    }

    clearInput = () => {
      this.setState({ stateValue: '' }, this.sendChange)
    }

    sendChange = () => {
      const { onChange } = this.props
      const { stateValue } = this.state

      if (typeof onChange === 'function') {
        onChange(stateValue)
      }
    }

    handleChange = (changeEvent) => {
      const { debounce } = this.props
      if (debounce) {
        this.setState({ stateValue: changeEvent.target.value })
        if (typeof this.cancelChange === 'number') {
          clearTimeout(this.cancelChange)
          this.cancelChange = null
        }
        this.cancelChange = setTimeout(this.sendChange, DEBOUNCE_TIMEOUT)
      } else {
        this.setState({ stateValue: changeEvent.target.value }, this.sendChange)
      }
    }

    handleKeyUp = (e) => {
      const { onKeyUp } = this.props
      if (onKeyUp && typeof onKeyUp === 'function') {
        onKeyUp(e)
      }
    }

    render() {
      const { stateValue } = this.state

      return (
        <WrappedComponent
          {...this.props}
          onChange={this.handleChange}
          onKeyUp={this.handleKeyUp}
          value={stateValue}
        />
      )
    }
	}

  DebouncedInput.propTypes = {
    onChange: PropTypes.func,
    onKeyUp: PropTypes.func,
    value: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    debounce: PropTypes.bool,
  }

  DebouncedInput.defaultProps = {
    onKeyUp: null,
    onChange: null,
    debounce: true,
    value: ''
  }

  return DebouncedInput
}

export default withDebouncedInput
