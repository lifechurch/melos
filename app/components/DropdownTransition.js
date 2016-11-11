import React, { Component, PropTypes } from 'react'


class DropdownTransition extends Component {

	render() {
		const { show, classes } = this.props

		return (
			<div className={`modal ${show ? '' : 'hide-modal'}` } >
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
	classes: React.PropTypes.string
}

export default DropdownTransition