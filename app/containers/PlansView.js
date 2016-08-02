import React, { Component } from 'react'

class PlansView extends Component {
	render() {
		const { children } = this.props

		return (
			<div>
				<div className='row horizontal-center discover-buttons'>
					<ul className='button-group primary-toggle'>
						<li><a className='solid-button green' href='#'>Discover</a></li>
						<li className='inactive'><a className='solid-button green' href='#'>My Plans</a></li>
					</ul>
				</div>
				{children}
			</div>
		)
	}
}

export default PlansView