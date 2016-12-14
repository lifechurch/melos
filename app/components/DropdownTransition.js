import React, { Component, PropTypes } from 'react'


class DropdownTransition extends Component {

	render() {
		const { show, classes, hideDir } = this.props
		let transitionDir = hideDir || 'up'

		return (
			<div className={`modal ${show ? '' : 'hide-modal'}` } >
				<div className={`element-to-translate ${classes ? classes : ''} ${transitionDir}`}>
					{this.props.children}
				</div>
			</div>
		)
	}
}


/**
 * @show       	{bool}    		show modal or hide modal
 * @classes 		{string}			additional classes to add to child
 * 														(usually component specific modal)
 */
DropdownTransition.propTypes = {
	show: React.PropTypes.bool,
	classes: React.PropTypes.string,
	hideDir: React.PropTypes.oneOf(['down', 'up', 'left', 'right'])
}

export default DropdownTransition