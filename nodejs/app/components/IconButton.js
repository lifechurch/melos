import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router'

function A({ children, href, onClick }) {
	return (<a target="_self" href={href} onClick={onClick}>{children}</a>)
}

class IconButton extends Component {
	constructor(props) {
		super(props)
		this._isMounted = false
		this.state = {
			isActive: false,
			isHover: false
		}
	}

	componentDidMount() {
		const { to } = this.props
		this._isMounted = true
		setTimeout(() => {
			if (this._isMounted) {
				this.setState({ isActive: window.location.pathname.indexOf(to) > -1
					&& (to.length > 1 || window.location.pathname === to)
					&& to.length <= window.location.pathname.length
				})
			}
		}, 300)
	}

	componentWillUnmount() {
		this._isMounted = false
	}

	handleMouseOver = () => {
		this.setState({ isHover: true })
	}

	handleMouseOut = () => {
		this.setState({ isHover: false })
	}

	render() {
		const {
			className,
			label,
			children,
			iconHeight,
			style,
			iconFill,
			labelColor,
			labelSize,
			to,
			useClientRouting,
			onClick,
			iconActiveFill,
			labelActiveColor,
			iconHoverFill,
			labelHoverColor,
			lockHeight
		} = this.props

		const {
			isActive,
			isHover
		} = this.state

		const LinkComponent = useClientRouting ? Link : A
		const linkProps = {
			tabIndex: 0,
			onClick
		}

		if (useClientRouting) {
			linkProps.to = to
		} else {
			linkProps.href = to
		}

		let currentLabelColor
		let currentIconFill
		if (isHover) {
			currentLabelColor = labelHoverColor
			currentIconFill = iconHoverFill
		} else if (isActive) {
			currentLabelColor = labelActiveColor
			currentIconFill = iconActiveFill
		} else {
			currentLabelColor = labelColor
			currentIconFill = iconFill
		}

		const childProps = { fill: currentIconFill }
		if (!lockHeight) {
			childProps.height = iconHeight
		}

		return (
			<div className={`yv-icon-button ${className}`} style={style} onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
				<LinkComponent {...linkProps}>
					<div className="yv-icon-button-svg">
						{
							children
								&& (children.length > 0 || !Array.isArray(children))
								&& React.cloneElement(children, childProps)
						}
					</div>
					{label && <div className="yv-icon-button-label" style={{ color: currentLabelColor, fontSize: labelSize }}>{label}</div>}
				</LinkComponent>
			</div>
		)
	}
}

IconButton.propTypes = {
	className: PropTypes.string,
	label: PropTypes.node,
	children: PropTypes.node.isRequired,
	iconHeight: PropTypes.number,
	style: PropTypes.object,
	iconFill: PropTypes.string,
	iconActiveFill: PropTypes.string,
	iconHoverFill: PropTypes.string,
	labelColor: PropTypes.string,
	labelActiveColor: PropTypes.string,
	labelHoverColor: PropTypes.string,
	labelSize: PropTypes.number,
	to: PropTypes.oneOfType([ PropTypes.string, PropTypes.object ]),
	useClientRouting: PropTypes.bool,
	lockHeight: PropTypes.bool,
	onClick: PropTypes.func
}

IconButton.defaultProps = {
	className: '',
	label: null,
	iconHeight: 20,
	style: null,
	iconFill: '#a2a2a2',
	iconActiveFill: '#444444',
	iconHoverFill: '#626262',
	labelColor: '#a2a2a2',
	labelActiveColor: '#444444',
	labelHoverColor: '#626262',
	labelSize: 12,
	to: null,
	useClientRouting: true,
	lockHeight: false,
	onClick: null
}

export default IconButton
