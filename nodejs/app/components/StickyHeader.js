import React, { Component, PropTypes } from 'react'

class StickyHeader extends Component {
	constructor(props) {
		super(props)
		this.didScroll = false
		this.state = {
			mode: 'fixed',
			lastScrollTop: 0,
			isLoggedIn: false,
			userId: null,
			ready: false,
			profileMenuOpen: false,
			screenSize: 0
		}
	}

	componentDidMount() {
		const { scrollDebounceTimeout } = this.props

		window.addEventListener('scroll', () => {
			this.didScroll = true
		})

		setInterval(() => {
			if (this.didScroll) {
				this.didScroll = false
				this.handleScroll()
			}
		}, scrollDebounceTimeout)
	}

	handleScroll = () => {
		const { lastScrollTop } = this.state
		const scrollTop = (window.pageYOffset || document.documentElement.scrollTop)
		const atTop = window.pageYOffset === 0
		const atBottom = ((window.innerHeight + Math.ceil(window.pageYOffset + 1)) >= document.body.scrollHeight - 105)

		let mode
		if (atTop || atBottom) {
			mode = 'fixed'
		} else if (lastScrollTop < scrollTop) {
			// scroll down
			mode = 'hidden'
		} else {
			// scroll up
			mode = 'fixed'
		}

		this.setState(() => {
			return {
				mode,
				lastScrollTop: scrollTop
			}
		})
	}

	render() {
		const {
      className,
      children,
      pinTo,
      topOffset
    } = this.props

		const {
      mode
    } = this.state

		const style = {}
		if (topOffset > 20) {
			style.marginTop = topOffset - 10
			style.paddingTop = 10
			style.zIndex = 97
		} else {
			style.marginTop = topOffset
		}

		return (
			<div className={`yv-sticky-header yv-sticky-header-pin-to-${pinTo} ${className}`}>
				<div className={`yv-sticky-header-content yv-sticky-header-${mode}`} style={style}>
					{children}
				</div>
			</div>
		)
	}
}

StickyHeader.propTypes = {
	className: PropTypes.string,
	children: PropTypes.node,
	pinTo: PropTypes.oneOf(['top', 'bottom']),
	scrollDebounceTimeout: PropTypes.number,
	topOffset: PropTypes.number
}

StickyHeader.defaultProps = {
	className: '',
	children: null,
	pinTo: 'top',
	scrollDebounceTimeout: 100,
	topOffset: 0
}

export default StickyHeader
