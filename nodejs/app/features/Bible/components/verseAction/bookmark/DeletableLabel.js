import React, { Component } from 'react'
import PropTypes from 'prop-types'
import XMark from '../../../../../components/XMark'


class DeletableLabel extends Component {

	constructor(props) {
		super(props)

		this.onDelete = ::this.onDelete
	}

	onDelete() {
		const { onDelete, label } = this.props
		if (typeof onDelete === 'function') {
			onDelete(label)
		}
	}

	render() {
		const { label, onDelete } = this.props

		return (
			<div className='deletable-label'>
				<span className='label-title'>{ label }</span>
				<span onClick={this.onDelete} className='delete'><XMark /></span>
			</div>
		)
	}
}


/**
 * 		@label					  		string of label
 * 		@onDelete							function to call when deleting label
 */
DeletableLabel.propTypes = {
	label: PropTypes.string.isRequired,
	onDelete: PropTypes.func
}

export default DeletableLabel