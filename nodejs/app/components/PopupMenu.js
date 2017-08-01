import React, { Component, PropTypes } from 'react'
import XMark from './XMark'
import EllipsisMoreIcon from './EllipsisMoreIcon'
import Menu from './Menu'
import ClickTarget from './ClickTarget'


class PopupMenu extends Component {

	constructor(props) {
		super(props)
		this.state = {
			show: false,
		}
	}

	onClose = () => {
		this.setState({ show: false })
	}

	handleToggle = () => {
		this.setState((prevState) => {
			return { show: !prevState.show }
		})
	}

	render() {
		const { triggerButton, closeButton, children, header, footer } = this.props
		const { show } = this.state
		let trigger = null

		// if we're wanting to show two different trigger buttons
		// toggle between them, if not than we always render triggerButton prop
		if (show) {
			if (closeButton) {
				trigger = closeButton
			}
		} else if (triggerButton) {
			trigger = triggerButton
		}

		return (
			<div className='popup-menu-container'>
				<a tabIndex={0} onClick={this.handleToggle}>
					<div className='trigger'>
						{ trigger }
					</div>
				</a>
				{
					show &&
					<ClickTarget handleOutsideClick={this.onClose}>
						<Menu
							customClass='popup-menu'
							header={header}
							footer={footer}
						>
							<div role='presentation' onClick={this.handleToggle}>
								{ children }
							</div>
						</Menu>
					</ClickTarget>
				}
			</div>
		)
	}
}

PopupMenu.propTypes = {
	triggerButton: PropTypes.node,
	closeButton: PropTypes.node,
	header: PropTypes.node,
	footer: PropTypes.node,
	children: PropTypes.node.isRequired
}

PopupMenu.defaultProps = {
	triggerButton: <EllipsisMoreIcon />,
	closeButton: <XMark width={14.4} height={13.7} />,
	header: null,
	footer: null,
}

export default PopupMenu
