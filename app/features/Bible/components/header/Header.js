import React, { Component, PropTypes } from 'react'
import Waypoint from 'react-waypoint'


class Header extends Component {

	constructor(props) {
		super(props)
		this.state = {
			fixed: false
		}
	}

	render() {
		const { sticky } = this.props
		const { fixed } = this.state

		let way = null
		if (sticky) {
			way = (
				<div className='waypoint'>
					<Waypoint onEnter={() => this.setState({ fixed: false })} onLeave={() => this.setState({ fixed: true })} />
				</div>
			)
		}

		return (
			<div className={`${fixed ? 'show-fixed' : ''}`}>
				{ way }
				<div className={`reader-header horizontal-center`}>
					{ this.props.children }
				</div>
			</div>
		)
	}
}

Header.propTypes = {

}

export default Header