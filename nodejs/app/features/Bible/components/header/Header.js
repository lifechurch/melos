import React, { Component, PropTypes } from 'react'
import Waypoint from 'react-waypoint'

class Header extends Component {

	constructor(props) {
		super(props)
		this.state = {
			showFixed: false
		}
	}

	fixHeader = () => {
		this.setState({
			showFixed: true
		})
	}

	unfixHeader = () => {
		this.setState({
			showFixed: false
		})
	}

	render() {
		const { sticky, classes } = this.props
		const { showFixed } = this.state

		let way = null
		if (sticky) {
			way = (
				<div className='waypoint'>
					<Waypoint onEnter={this.unfixHeader} onLeave={this.fixHeader} />
				</div>
			)
		}

		return (
			<div className={`yv-reader-header-container ${showFixed ? 'show-fixed' : ''}`}>
				{ way }
				<div className={`${classes} react-header ${sticky ? 'fixed' : ''}`}>
					{ this.props.children }
				</div>
			</div>
		)
	}
}

/**
 * @param      {bool} sticky {do we want the header to become fixed when it scrolls away?}
 * @param      {string} classes {classes to attach to header div}
 */
Header.propTypes = {
	sticky: PropTypes.bool,
	classes: PropTypes.string,
}

export default Header
