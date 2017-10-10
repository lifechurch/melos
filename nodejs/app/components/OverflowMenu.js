import React, { PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import PopupMenu from './PopupMenu'

function OnClick(props) {
	const { onClick, link, children } = props
	return (
		onClick &&
			<a tabIndex={0} href={link} className='font-grey text-center' onClick={onClick}>
				{ children }
			</a>
	)
}

export function Edit(props) {
	const { onClick } = props
	return (
		<OnClick onClick={onClick}>
			<li><FormattedMessage id='edit' /></li>
		</OnClick>
	)
}

export function Delete(props) {
	const { onClick } = props
	return (
		<OnClick onClick={onClick}>
			<li><FormattedMessage id='delete' /></li>
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
