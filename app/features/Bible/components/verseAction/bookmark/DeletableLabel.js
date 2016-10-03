import React, { Component, PropTypes } from 'react'
import XMark from '../../../../../components/XMark'


class DeletableLabel extends Component {

	render() {
		const { label, onDelete } = this.props

		return (
			<div className='deletable-label'>
				<span className='label-title'>{ label }</span>
				<span onClick={onDelete.bind(this, label)} className='delete'><XMark /></span>
			</div>
		)
	}
}


/**
 * 		@label					  		string of label
 * 		@onDelete							function to call when deleting label
 */
DeletableLabel.propTypes = {
	label: React.PropTypes.string.isRequired,
	onDelete: React.PropTypes.func
}

export default DeletableLabel