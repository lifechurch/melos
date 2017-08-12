import React, { PropTypes } from 'react'
import ShareIcon from './Icons/ShareIcon'
import ClickToCopy from './ClickToCopy'
import Share from '../features/Bible/components/verseAction/share/Share'

function ShareLink({ link, description, text }) {

	return (
		<div className='centered' style={{ padding: '25px 0' }}>
			<div className='text-center'>
				{ description }
			</div>
			<div className='vertical-center horizontal-center flex-wrap'>
				<div style={{ margin: '25px 10px' }}>
					<ClickToCopy text={link} customClass='yv-gray-link share-link'>
						{ link }
					</ClickToCopy>
				</div>
				<a>
					<Share
						text={text}
						url={link}
						button={
							<ShareIcon />
						}
					/>
				</a>
			</div>
		</div>
	)
}

ShareLink.propTypes = {
	link: PropTypes.string.isRequired,
	description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
	text: PropTypes.string.isRequired,
}


export default ShareLink
