import React, { Component } from 'react'
import PropTypes from 'prop-types'

class ClickTarget extends Component {

	componentDidMount() {
		if (typeof window !== 'undefined') {
			// Listen for Mouse Down Outside Events
			window.addEventListener('mousedown', this.handleOutsideClick, false);
		}
	}

	componentWillUnmount() {
		if (typeof window !== 'undefined') {
			window.removeEventListener('mousedown', this.handleOutsideClick);
		}
	}

	handleOutsideClick = () => {
		const { handleOutsideClick, handleInsideClick } = this.props
		if (!this.insideClick) {
			if (typeof handleOutsideClick === 'function') {
				handleOutsideClick()
			}
		} else if (typeof handleInsideClick === 'function') {
			handleInsideClick()
		}
	}

	handleMouseDown = () => {
		this.insideClick = true
	}

	handleMouseUp = () => {
		this.insideClick = false
	}

	render() {
		const { children } = this.props
		return (
			<div onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp}>
				{ children }
			</div>
		)
	}
}


ClickTarget.propTypes = {
	handleOutsideClick: PropTypes.func,
	handleInsideClick: PropTypes.func,
	children: PropTypes.node,
}

ClickTarget.defaultProps = {
	handleOutsideClick: null,
	handleInsideClick: null,
	children: null,
}

export default ClickTarget
