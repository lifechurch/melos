import React, { PropTypes } from 'react'
import { Link } from 'react-router'

function A({ children, href, onClick }) {
	return (<a target="_self" href={href} onClick={onClick}>{children}</a>)
}

function IconButton({ className, label, children, iconHeight, style, iconFill, labelColor, labelSize, to, useClientRouting, onClick, iconActiveFill, labelActiveColor, lockHeight }) {
	const LinkCompnent = useClientRouting ? Link : A
	const linkProps = {
		tabIndex: 0,
		onClick
	}

	if (useClientRouting) {
		linkProps.to = to
	} else {
		linkProps.href = to
	}

	let isActive = false
	if (typeof window !== 'undefined') {
		isActive = window.location.pathname.indexOf(to) > -1
			&& (to.length > 1 || window.location.pathname === to)
			&& to.length <= window.location.pathname.length
	}

	const childProps = { fill: isActive ? iconActiveFill : iconFill }
	if (!lockHeight) {
		childProps.height = iconHeight
	}

	return (
		<div className={`yv-icon-button ${className}`} style={style}>
			<LinkCompnent {...linkProps}>
				<div className="yv-icon-button-svg">
					{children && React.cloneElement(children, childProps)}
				</div>
				{label && <div className="yv-icon-button-label" style={{ color: isActive ? labelActiveColor : labelColor, fontSize: labelSize }}>{label}</div>}
			</LinkCompnent>
		</div>
	)
}

IconButton.propTypes = {
	className: PropTypes.string,
	label: PropTypes.node,
	children: PropTypes.node.isRequired,
	iconHeight: PropTypes.number,
	style: PropTypes.object,
	iconFill: PropTypes.string,
	iconActiveFill: PropTypes.string,
	labelColor: PropTypes.string,
	labelActiveColor: PropTypes.string,
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
	iconFill: '#444444',
	iconActiveFill: '#6ab750',
	labelColor: '#444444',
	labelActiveColor: '#6ab750',
	labelSize: 12,
	to: null,
	useClientRouting: true,
	lockHeight: false,
	onClick: null
}

export default IconButton
