import React, { Component } from 'react'

class Row extends Component {
	render() {
		const { children, id, className } = this.props
		return (
			<div id={id} className={`${className} row`}>
				{children}
			</div>
		)
	}
}

export default Row
