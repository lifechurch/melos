import React, { Component } from 'react'

class Row extends Component {
	render() {
		const { children, className } = this.props
		return (
			<div className={className + ' row'}>
				{children}
			</div>
		)
	}
}

export default Row