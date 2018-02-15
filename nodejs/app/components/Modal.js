import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ClickTarget from './ClickTarget'
import XMark from './XMark'


class Modal extends Component {

	constructor(props) {
		super(props)
		this.state = {
			show: false,
		}
	}

	handleClose = () => {
		const { handleCloseCallback } = this.props
		// if we've been passed a callback to fire on close
		if (handleCloseCallback && typeof handleCloseCallback === 'function') {
			handleCloseCallback()
		}
		this.setState({ show: false })
	}

	handleOpen = () => {
		this.setState({ show: true })
	}

	render() {
		const {
			customClass,
			heading,
			showBackground,
			style,
			closeOnOutsideClick,
			children
		} = this.props
		const { show } = this.state

		return (
			<div className='yv-modal-container'>
				{
					showBackground &&
					<div className={`yv-modal-background ${show ? '' : 'yv-hide-modal'}`} />
				}
				<div
					className={`yv-modal ${show ? '' : 'yv-hide-modal'}` }
					style={{ ...style, pointerEvents: closeOnOutsideClick ? 'initial' : 'none' }}
				>
					<div className={`content-wrapper ${customClass}`} style={{ pointerEvents: 'initial' }}>
						<ClickTarget handleOutsideClick={show && closeOnOutsideClick && this.handleClose}>
							<div className='modal-heading'>
								{ heading }
								<a tabIndex={0} className='margin-left-auto' onClick={this.handleClose}>
									<XMark width={20} height={20} fill='white' />
								</a>
							</div>
							<div className='modal-content'>
								{ children }
							</div>
						</ClickTarget>
					</div>
				</div>
			</div>
		)
	}
}


/**
 */
Modal.propTypes = {
	customClass: PropTypes.string,
	showBackground: PropTypes.bool,
	closeOnOutsideClick: PropTypes.bool,
	style: PropTypes.object,
	heading: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
	children: PropTypes.node,
	handleCloseCallback: PropTypes.func,
}

Modal.defaultProps = {
	children: null,
	showBackground: true,
	closeOnOutsideClick: true,
	customClass: '',
	heading: null,
	style: {},
	handleCloseCallback: null,
}

export default Modal
