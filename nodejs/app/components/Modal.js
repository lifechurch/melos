import React, { Component, PropTypes } from 'react'
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
		const { customClass, heading, showBackground, style, children } = this.props
		const { show } = this.state

		return (
			<div className='yv-modal-container'>
				{
					showBackground &&
					<div className={`yv-modal-background ${show ? '' : 'yv-hide-modal'}`} />
				}
				<div className={`yv-modal ${show ? '' : 'yv-hide-modal'}` } style={style}>
					<div className={customClass}>
						<ClickTarget handleOutsideClick={show && this.handleClose}>
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
	style: PropTypes.object,
	heading: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
	children: PropTypes.node,
	handleCloseCallback: PropTypes.func,
}

Modal.defaultProps = {
	children: null,
	showBackground: true,
	customClass: '',
	heading: null,
	style: null,
	handleCloseCallback: null,
}

export default Modal
