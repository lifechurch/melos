import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import CheckMark from '../CheckMark'

class AsyncCheck extends Component {
	constructor(props) {
		super(props)
		const { initialValue } = props
		this.state = {
			checked: !!initialValue,
			showSuccess: false
		}
	}

	componentWillReceiveProps(nextProps) {
		const { initialValue } = this.props
		const { initialValue: nextInitialValue } = nextProps
		if (initialValue !== nextInitialValue) {
			this.setState(() => {
				return { checked: nextInitialValue }
			})
		}
	}

	handleChange = () => {
		const { onChange, data, enabled, offOnly } = this.props
		const offOnlyDisabled = offOnly && !this.state.checked

		if (enabled && !offOnlyDisabled) {
			this.setState((state) => {
				const checked = !state.checked

				if (typeof onChange === 'function') {
					const promise = onChange({ checked, data })
					if (typeof promise !== 'undefined' && typeof promise.then === 'function') {
						promise.then(() => {
							this.setState(() => {
								setTimeout(() => {
									this.setState(() => {
										return { showSuccess: false }
									})
								}, 5000)
								return { showSuccess: true }
							})
						})
					}
				}

				return { checked }
			})
		}
	}

	render() {
		const { label, enabled, image, successMessage, offOnly } = this.props
		const { checked, showSuccess } = this.state
		const offOnlyDisabled = offOnly && !checked
		return (
			<div className={`yv-async-check ${checked ? 'checked' : 'not-checked'} ${enabled && !offOnlyDisabled ? '' : 'disabled'}`}>
				<a className="check-box" tabIndex={0} onClick={enabled && !offOnlyDisabled ? this.handleChange : null}>
					{checked && <CheckMark width={15} height={15} fill="#FFFFFF" />}
				</a>
				{image && <img alt="" className="check-thumbnail" src={image.url} />}
				{label}
				{successMessage && <span className={`success-message ${showSuccess ? '' : 'hidden'}`}>{successMessage}</span>}
			</div>
		)
	}
}

AsyncCheck.propTypes = {
	label: PropTypes.node,
	data: PropTypes.any,
	initialValue: PropTypes.bool,
	onChange: PropTypes.func,
	enabled: PropTypes.bool,
	image: PropTypes.string,
	successMessage: PropTypes.node,
	offOnly: PropTypes.bool
}

AsyncCheck.defaultProps = {
	label: '',
	data: null,
	initialValue: false,
	onChange: null,
	enabled: true,
	image: null,
	successMessage: (<FormattedMessage id="unsubscribe.saved" />),
	offOnly: false
}

export default AsyncCheck
