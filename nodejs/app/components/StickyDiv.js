import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Waypoint from 'react-waypoint'

class StickyDiv extends Component {

	constructor(props) {
		super(props)
		this.state = {
			showFixed: false
		}
	}

	handleFixStickyDiv = () => {
		this.setState({
			showFixed: true
		})
	}

	handleUnfixStickyDiv = () => {
		this.setState({
			showFixed: false
		})
	}

	render() {
		const { sticky, classes, fixPosition, children } = this.props
		const { showFixed } = this.state

		return (
			<div className={`${showFixed ? 'show-fixed' : ''} ${fixPosition === 'bottom' ? 'fix-to-bottom' : 'fix-to-top'}`}>
				{
					sticky &&
					<div className='waypoint'>
						<Waypoint onEnter={this.handleUnfixStickyDiv} onLeave={this.handleFixStickyDiv} />
					</div>
				}
				<div className={`sticky-div ${sticky ? 'fixed' : ''} ${classes}`}>
					{ children }
				</div>
			</div>
		)
	}
}

/**
 * @param      {bool} sticky {do we want the header to become fixed when it scrolls away?}
 * @param      {string} classes {classes to attach to header div}
 */
StickyDiv.propTypes = {
	sticky: PropTypes.bool,
	classes: PropTypes.string,
	fixPosition: PropTypes.string,
	children: PropTypes.node.isRequired,
}

StickyDiv.defaultProps = {
	sticky: true,
	classes: '',
	fixPosition: 'bottom',
}

export default StickyDiv
