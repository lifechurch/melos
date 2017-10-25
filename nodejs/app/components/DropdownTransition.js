import React, { Component, PropTypes } from 'react'

class DropdownTransition extends Component {

	constructor(props) {
		super(props)
		this.state = {
			show: false,
		}
	}

	componentDidMount() {
		if (typeof window !== 'undefined') {
			// Listen for Mouse Down Outside Events
			window.addEventListener('mousedown', this.handleOutsideClick, false);
		}
	}

	componentDidUpdate(prevProps) {
		const { show } = this.props

		if (typeof window !== 'undefined' && show !== prevProps.show) {
			if (show) {
				document.getElementsByTagName('body')[0].classList.add('modal-open')
			} else {
				document.getElementsByTagName('body')[0].classList.remove('modal-open')
			}
		}
	}

	componentWillUnmount() {
		if (typeof window !== 'undefined') {
			window.removeEventListener('mousedown', this.handleOutsideClick);
		}
	}

	handleOutsideClick = (e) => {
		const { onOutsideClick, exemptClass, exemptSelector } = this.props
		let exempt = false

		if (this.insideClick) {
			return
		}

		const event = e || window.event
		const target = event.target || event.srcElement

		// if we want to allow an outside click and not close the modal,
		// then we pass the exempt class here
		if (exemptClass && typeof window !== 'undefined') {
			// loop through all nodes with the exempt class, and check if
			// the element that was clicked on, is a child of the exempt class
			Array.prototype.forEach.call(document.getElementsByClassName(exemptClass), (exemptNode) => {
				if (exemptNode.contains(target)) exempt = true
			})

		// or we can pass a selector instead of a class
		} else if (exemptSelector && typeof window !== 'undefined') {
			// loop through all nodes with the exempt class, and check if
			// the element that was clicked on, is a child of the exempt class
			Array.prototype.forEach.call(document.querySelectorAll(exemptSelector), (exemptNode) => {
				if (exemptNode.contains(target)) exempt = true
			})
		}

		// only call close if we've found the click event is not exempt
		if (!exempt && typeof onOutsideClick === 'function') {
			onOutsideClick()
		}
	}

	handleMouseDown = () => {
		this.insideClick = true
	}

	handleMouseUp = () => {
		this.insideClick = false
	}

	render() {
		const { classes, hideDir, show, transition, containerClasses, children } = this.props
		const transitionDir = hideDir || 'up'
		const showTransition = transition || false

		return (
			<div
				className={`modal ${show ? '' : 'hide-modal'} ${showTransition ? 'dropdown-transform' : ''} ${containerClasses}` }
				onMouseDown={this.handleMouseDown}
				onMouseUp={this.handleMouseUp}
			>
				<div className={`element-to-translate ${classes || ''} ${showTransition ? 'dropdown-transform' : ''} ${transitionDir}`}>
					{ children }
				</div>
			</div>
		)
	}
}


/**
 * @show       	{bool}    		show modal or hide modal
 * @transition	{bool}				show we transition through the dropdown? or just make it show instantly
 * @classes 		{string}			additional classes to add to child
 * 														(usually component specific modal)
 */
DropdownTransition.propTypes = {
	show: PropTypes.bool,
	transition: PropTypes.bool,
	classes: PropTypes.string,
	containerClasses: PropTypes.string,
	hideDir: PropTypes.oneOf(['down', 'up', 'left', 'right']),
	onOutsideClick: PropTypes.func,
	exemptClass: PropTypes.string,
	exemptSelector: PropTypes.string,
	children: PropTypes.node
}

DropdownTransition.defaultProps = {
	show: false,
	transition: false,
	classes: null,
	containerClasses: 'yv-popup-modal-container',
	hideDir: 'up',
	onOutsideClick: null,
	exemptClass: null,
	exemptSelector: null,
	children: null
}

export default DropdownTransition
