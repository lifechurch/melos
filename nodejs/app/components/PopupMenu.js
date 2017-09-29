import React, { Component, PropTypes } from 'react'
import XMark from './XMark'
import Ellipsis from './icons/Ellipsis'

class PopupMenu extends Component {

	constructor(props) {
		super(props)
		this.state = {
			show: false,
		}
	}

	handleToggle = () => {
		this.setState((prevState) => {
			return { show: !prevState.show }
		})
	}

	render() {
		const { triggerButton, closeButton } = this.props
		const { show } = this.state
		let menu, trigger

		if (show) {
			if (closeButton) {
				trigger = closeButton
			}
			menu = this.props.children
		} else if (triggerButton) {
			trigger = triggerButton
		}

		return (
			<div className='popup-menu' style={{ marginLeft: 15, marginTop: 1, display: 'inline-block', float: 'right' }}>
				<a tabIndex={0} onClick={this.handleToggle}><div className="trigger">{ trigger }</div></a>
				<div onClick={this.handleToggle}>{ menu }</div>
			</div>
		)
	}
}

PopupMenu.propTypes = {
	triggerButton: PropTypes.node,
	closeButton: PropTypes.node,
	children: PropTypes.node.isRequired
}

PopupMenu.defaultProps = {
	triggerButton: <Ellipsis height={16} />,
	closeButton: <XMark width={16} height={13.7} />,
}

export default PopupMenu
