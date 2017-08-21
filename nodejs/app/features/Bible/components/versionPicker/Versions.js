import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import AudioIcon from '../../../../components/AudioIcon'

function Versions(props) {
	const {
		list,
		map,
		header,
		initialSelection,
		focus,
		usfm,
		listSelectionIndex,
		onMouseOver,
		localizedLink,
		onClick,
		cancel,
		linkBuilder
	} = props

	if (list) {
		const versionList = []
		const idList = (map && map.length > 0) ? map : Object.keys(list)

		idList.forEach((id, index) => {
			if (id in list) {
				const version = list[id]
				const active = (parseInt(id, 10) === parseInt(initialSelection, 10)) ? 'active' : ''
				const name = version.local_title || version.title
				let abbr = version.local_abbreviation || version.abbreviation
				abbr = abbr.toLocaleUpperCase()

				const handleMouseOver = () => {
					if (typeof onMouseOver === 'function') {
						onMouseOver('versions', index)
					}
				}

				const handleClick = (event) => {
					if (typeof onClick === 'function') {
						event.preventDefault()
						onClick({
							id,
							abbr,
							name,
							version,
							usfm
						})

						if (typeof cancel === 'function') {
							cancel()
						}
					}
				}

				const path = localizedLink(linkBuilder(id, usfm, abbr.toLowerCase().split('-')[0]))

				if (focus) {
					const focusClass = (index === listSelectionIndex) ? 'focus' : ''

					versionList.push(
						<Link
							key={id}
							to={path}
							onClick={handleClick}
						>
							{
								// show audio icon next to name
								version.audio
									?
										<li className={`${active} ${focusClass}`}>
											<div className={'small-10'} onMouseOver={handleMouseOver}>
												{ `${abbr} ${name}` }
											</div>
											<div className={'small-2'}>
												<AudioIcon color={(id === initialSelection) ? 'white' : 'gray'} />
											</div>
										</li>

									:
										<li className={`${active} ${focusClass}`} onMouseOver={handleMouseOver}>
											{ `${abbr} ${name}` }
										</li>
							}
						</Link>
						)
				} else {
					versionList.push(
						<Link
							key={id}
							to={path}
							onClick={handleClick}
						>
							{
								// show audio icon next to name
								version.audio
									?
									<li className={`${active}`}>
										<div className={'small-10'}>
											{ `${abbr} ${name}` }</div>
										<div className={'small-2'}>
											<AudioIcon color={(id === initialSelection) ? 'white' : 'gray'} />
										</div>
									</li>
									:
									<li className={`${active}`} >{ `${abbr} ${name}` }</li>
								}
						</Link>
						)
				}
			}
		})
			/* the header would either be the language title or recently used */
		const title = header ? <p className='version-header'>{ header }</p> : null
		return (
			<div className='versions'>
				{ title }
				<ul>{ versionList }</ul>
			</div>
		)
	} else {
		return (
			<div />
		)
	}
}


/**
 * 		@list					  			object of version objects for the specific language
 * 		@map									list of version ids sorted alphabetically
 * 		@header								bold header for version list–either language title or recently used
 * 		@onSelect			  			function to call when selecting version
 * 		@initialSelection	   	id for highlighting currently selected version
 * 		@onMouseOver					function to call when hovering over version
 * 		@listSelectionIndex 	index for selecting list element with arrow keys
 * 		@focus								allow mouse over and key actions on list items
 */
Versions.propTypes = {
	list: PropTypes.object,
	map: PropTypes.array,
	header: PropTypes.string,
	initialSelection: PropTypes.number,
	onMouseOver: PropTypes.func,
	listSelectionIndex: PropTypes.number,
	focus: PropTypes.bool,
	onClick: PropTypes.func,
	usfm: PropTypes.string,
	localizedLink: PropTypes.func,
	cancel: PropTypes.func,
	linkBuilder: PropTypes.func.isRequired
}

Versions.defaultProps = {
	list: {},
	map: [],
	header: null,
	initialSelection: null,
	onMouseOver: null,
	listSelectionIndex: null,
	focus: true,
	onClick: null,
	usfm: null,
	localizedLink: null,
	cancel: null,
}

export default Versions
