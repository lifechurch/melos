import React, { Component, PropTypes } from 'react'
import ViewportUtils from '../lib/viewportUtils'
import { ScreenSize, getScreenSize } from '../lib/responsiveConstants'

class ResponsiveContainer extends Component {
	constructor(props) {
		super(props)
		this.state = {
			screenSize: ScreenSize.SMALL,
			screenWidth: null
		}
		this.viewportUtils = new ViewportUtils()
	}

	componentDidMount() {
		this.viewportUtils.registerListener('resize', this.handleWindowResize)
	}

	handleWindowResize = (viewport) => {
		const screenWidth = parseInt(viewport.width, 10)
		const screenSize = getScreenSize(screenWidth)
		this.setState({ screenSize, screenWidth })
	}

	render() {
		const {
      children,
      className
    } = this.props

		const {
      screenSize,
      screenWidth
    } = this.state

		return (
			<div className={`yv-responsive-container ${className}`}>
				{children &&
					React.Children.map(children, (child => {
						return React.cloneElement(child, { screenSize, screenWidth })
					}))
				}
			</div>
		)
	}
}

ResponsiveContainer.propTypes = {
	className: PropTypes.string,
	children: PropTypes.node
}

ResponsiveContainer.defaultProps = {
	className: '',
	children: null
}

export default ResponsiveContainer
