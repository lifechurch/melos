import React, { Component, PropTypes } from 'react'

class TriggerButton extends Component {

	constructor(props) {
		super(props)
		this.state = { isOpen: props.isOpen || false }
	}

	handleClick() {
		const { onClick } = this.props
		const { isOpen } = this.state
		if (typeof onClick === 'function') {
			onClick({ isOpen: !isOpen })
		}
		this.setState({ isOpen: !isOpen })
	}

	componentWillReceiveProps(nextProps) {
		const { isOpen } = this.state
		if (isOpen !== nextProps.isOpen) {
			this.setState({
				isOpen: nextProps.isOpen,
			})
		}
	}

	render() {
		const { image, label } = this.props
		const { isOpen } = this.state

		let imageEl = null
		if (typeof image !== 'undefined') {
			imageEl = (<div className='trigger-button-image'>{image}</div>)
		}

		let labelEl = null
		if (typeof label === 'string' && label.length > 0) {
			labelEl = (<span className='trigger-button-label'>{label}</span>)
		}

		const openClassName = isOpen ? 'open' : ''

		return (
			<div className={`trigger-button ${openClassName}`} onClick={::this.handleClick} >
				{imageEl}
				{labelEl}
			</div>
		)
	}
}

TriggerButton.propTypes = {
	onClick: React.PropTypes.func,
	image: React.PropTypes.element,
	label: React.PropTypes.string,
	isOpen: React.PropTypes.bool
}

export default TriggerButton