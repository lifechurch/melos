import React, { Component, PropTypes } from 'react'

class StickyHeader extends Component {
	constructor(props) {
		super(props)
		this.didScroll = false
		this._isMounted = false
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

		this._isMounted = true

		window.addEventListener('scroll', () => {
			this.didScroll = true
		})

		setInterval(() => {
			if (this.didScroll && this._isMounted) {
				this.didScroll = false
				this.handleScroll()
			}
		}, scrollDebounceTimeout)
	}

	componentWillUnmount() {
		this._isMounted = false
	}

	handleScroll = () => {
		const { lastScrollTop } = this.state
		const scrollTop = (window.pageYOffset || document.documentElement.scrollTop)
		const atTop = window.pageYOffset <= 0
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
      verticalOffset,
			translationDistance,
			isSticky,
			stackOrder,
    } = this.props

		const {
      mode
    } = this.state

		// we need to stack headers properly so the padding from the next header
		// doesn't cover up the previous
		const style = {
			zIndex: 99 - stackOrder,
		}
		const paddingKey = pinTo === 'top' ? 'paddingTop' : 'paddingBottom'
		if (verticalOffset > 0) {
			style[paddingKey] = verticalOffset
		}

		const translation = pinTo === 'top' ? `-${translationDistance}` : translationDistance
		if (mode === 'hidden') {
			style.transform = `translateY(${translation})`
		}

		return (
			<div className={isSticky ? `yv-sticky-header yv-sticky-header-pin-to-${pinTo} ${className}` : `${className}`}>
				<div className={isSticky ? `yv-sticky-header-content yv-sticky-header-${mode}` : ''} style={isSticky ? style : {}}>
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
	verticalOffset: PropTypes.number,
	stackOrder: PropTypes.number,
	translationDistance: PropTypes.string,
	isSticky: PropTypes.bool
}

StickyHeader.defaultProps = {
	className: '',
	children: null,
	pinTo: 'top',
	scrollDebounceTimeout: 100,
	verticalOffset: 0,
	stackOrder: 0,
	translationDistance: '100%',
	bottomOffset: 0,
	isSticky: true
}

export default StickyHeader
