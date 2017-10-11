import React, { PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import PopupMenu from './PopupMenu'

function OnClick(props) {
	const { onClick, link, children } = props
	return (
		<a tabIndex={0} href={link} className='font-grey text-center' onClick={onClick}>
			{ children }
		</a>
	)
}

export function Read(props) {
	const { onClick, link } = props
	return (
		<OnClick onClick={onClick} link={link}>
			<li><FormattedMessage id='read' /></li>
		</OnClick>
	)
}

export function ReadFullChapter(props) {
	const { onClick, link } = props
	return (
		<OnClick onClick={onClick} link={link}>
			<li><FormattedMessage id='read full chapter' /></li>
		</OnClick>
	)
}

export function Copy(props) {
	const { onClick, link } = props
	return (
		<OnClick onClick={onClick} link={link}>
			<li><FormattedMessage id='copy' /></li>
		</OnClick>
	)
}

export function Share(props) {
	const { onClick, link } = props
	return (
		<OnClick onClick={onClick} link={link}>
			<li><FormattedMessage id='share' /></li>
		</OnClick>
	)
}

export function Edit(props) {
	const { onClick, link } = props
	return (
		<OnClick onClick={onClick} link={link}>
			<li><FormattedMessage id='edit' /></li>
		</OnClick>
	)
}

export function Delete(props) {
	const { onClick, link } = props
	return (
		<OnClick onClick={onClick} link={link}>
			<li className='warning-text'><FormattedMessage id='delete' /></li>
		</OnClick>
	)
}

function OverflowMenu(props) {
	const { children } = props

	return (
		children
			&& (children.length > 0 || !Array.isArray(children))
			&& (
				<PopupMenu>
					<ul>
						{ children }
					</ul>
				</PopupMenu>
			)
	)
}

OverflowMenu.propTypes = {

}

OverflowMenu.defaultProps = {

}

export default OverflowMenu
