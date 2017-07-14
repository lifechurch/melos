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
		this.setState({ show: false })
	}
	handleOpen = () => {
		this.setState({ show: true })
	}

	render() {
		const { customClass, heading, showBackground, children } = this.props
		const { show } = this.state

		return (
			<div>
				{
					showBackground &&
					<div className={`modal-background ${show ? '' : 'hide-modal'}`} />
				}
				<ClickTarget handleOutsideClick={this.handleClose}>
					<div className={`modal ${show ? '' : 'hide-modal'} ${customClass || ''}` }>
						<div className='modal-heading'>
							{ heading }
							<a tabIndex={0} className='margin-left-auto' onClick={this.handleClose}>
								<XMark width={12} />
							</a>
						</div>
						<div className='modal-content'>
							{ children }
						</div>
					</div>
				</ClickTarget>
			</div>
		)
	}
}


/**
 */
Modal.propTypes = {
	customClass: PropTypes.string,
	showBackground: PropTypes.bool,
	heading: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
	children: PropTypes.node.isRequired,
}

Modal.defaultProps = {
	showBackground: true,
	customClass: '',
	heading: null,
}

export default Modal
