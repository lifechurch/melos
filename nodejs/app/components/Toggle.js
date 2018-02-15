import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CheckMark from './CheckMark'

class Toggle extends Component {

	constructor(props) {
		super(props)
		this.state = { value: props.initialValue }
		this.handleClick = ::this.handleClick
	}

	handleClick() {
		const { onClick } = this.props
		if (typeof onClick === 'function') {
			onClick(!this.state.value)
		}
		this.setState({ value: !this.state.value })
	}

	render() {
		const { label } = this.props
		const selectedClass = this.state.value ? 'selected' : ''
		return (
			<div tabIndex={0} className={`toggle ${selectedClass}`} onClick={this.handleClick}>
				<div className='yv-toggle-button'>
					<div className='yv-toggle-button-check-container'>
						{this.state.value && <CheckMark height={18} width={18} thin={true} fill="#444444" />}
					</div>
				</div>
				<div className='yv-toggle-label'>{label}</div>
			</div>
		)
	}
}

Toggle.propTypes = {
	label: PropTypes.node,
	initialValue: PropTypes.bool
}

Toggle.defaultProps = {
	label: null,
	initialValue: false
}

export default Toggle
