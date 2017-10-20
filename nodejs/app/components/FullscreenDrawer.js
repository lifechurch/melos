import React, { PropTypes } from 'react'
import DropdownTransition from './DropdownTransition'
import XMark from './XMark'
import YVLogo from './YVLogo'


function FullscreenDrawer(props) {
	const {
		isOpen,
		title,
		onClose,
		className,
		showLogo,
		hideDir,
		transition,
		children
	} = props
	return (
		<div className="yv-fullscreen-drawer yv-fullscreen-modal-container">
			<DropdownTransition
				show={isOpen}
				hideDir={hideDir}
				transition={transition}
				classes="yv-fullscreen-modal-content"
			>
				<div className='vertical-center space-between' style={{ padding: '25px' }}>
					{
						showLogo
							&& <YVLogo width={150} />
					}
					<a
						tabIndex={0}
						className="flex-end margin-left-auto"
						onClick={onClose}
					>
						<XMark width={20} height={20} fill="#444444" />
					</a>
				</div>
				<div className={className} style={{ paddingBottom: '50px' }}>
					<h2 className='drawer-title'>
						{ title }
					</h2>
					{ children }
				</div>
			</DropdownTransition>
		</div>
	)
}

FullscreenDrawer.propTypes = {
	isOpen: PropTypes.bool,
	className: PropTypes.string,
	title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
	hideDir: PropTypes.string,
	showLogo: PropTypes.bool,
	transition: PropTypes.bool,
	onClose: PropTypes.func.isRequired,
	children: PropTypes.node,
}

FullscreenDrawer.defaultProps = {
	isOpen: false,
	hideDir: 'down',
	className: '',
	title: null,
	showLogo: true,
	transition: true,
	children: null,
}

export default FullscreenDrawer
