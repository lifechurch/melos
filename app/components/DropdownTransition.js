import React, { Component, PropTypes } from 'react'


class DropdownTransition extends Component {

	render() {
		const { show, classes, dir } = this.props
		let transitionDir = dir || 'down'

		return (
			<div className={`modal ${show ? '' : 'hide-modal'} ${transitionDir}` } >
				<div className={`element-to-translate ${classes ? classes : ''}`}>
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
	dir: React.PropTypes.oneOf(['down, up, left, right'])
}

export default DropdownTransition