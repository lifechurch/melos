import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import PopupMenu from './PopupMenu'


/*  */
export function Item(props) {
	const { onClick, link, style = {}, className = '', children } = props
	return (
		<a
			tabIndex={0}
			href={link}
			className={`font-grey text-center ${className}`}
			style={style}
			onClick={onClick}
		>
			<li>{ children }</li>
		</a>
	)
}

export function Read(props) {
	const { onClick, link } = props
	return (
		<Item onClick={onClick} link={link}>
			<FormattedMessage id='read' />
		</Item>
	)
}

export function ReadFullChapter(props) {
	const { onClick, link } = props
	return (
		<Item onClick={onClick} link={link}>
			<FormattedMessage id='read full chapter' />
		</Item>
	)
}

export function Copy(props) {
	const { onClick, link } = props
	return (
		<Item onClick={onClick} link={link}>
			<FormattedMessage id='copy' />
		</Item>
	)
}

export function Share(props) {
	const { onClick, link } = props
	return (
		<Item onClick={onClick} link={link}>
			<FormattedMessage id='share' />
		</Item>
	)
}

export function Edit(props) {
	const { onClick, link } = props
	return (
		<Item onClick={onClick} link={link}>
			<FormattedMessage id='edit' />
		</Item>
	)
}

export function Delete(props) {
	const { onClick, link } = props
	return (
		<Item onClick={onClick} link={link} className='red'>
			<FormattedMessage id='delete' />
		</Item>
	)
}

export function Cancel(props) {
	const { onClick, link } = props
	return (
		<Item onClick={onClick} link={link}>
			<FormattedMessage id='cancel' />
		</Item>
	)
}

function OverflowMenu(props) {
	const { children } = props

	return (
		children
			&& (children.length > 0 || !Array.isArray(children))
			&& (
				<PopupMenu closeButton={null}>
					<ul>{ children }</ul>
				</PopupMenu>
			)
	)
}

OverflowMenu.propTypes = {
	children: PropTypes.node,
}

OverflowMenu.defaultProps = {
	children: null,
}

export default OverflowMenu
