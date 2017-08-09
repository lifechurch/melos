import React, { PropTypes } from 'react'
import ShareIcon from './Icons/ShareIcon'
import ClickToCopy from './ClickToCopy'
import Share from '../features/Bible/components/verseAction/share/Share'

function ShareLink({ link, description }) {

	return (
		<div className='centered' style={{ padding: '25px 0' }}>
			<div className='text-center' style={{ marginBottom: '20px' }}>
				{ description }
			</div>
			<div className='vertical-center horizontal-center'>
				<ClickToCopy text={link} customClass='yv-gray-link share-link'>
					{ link }
				</ClickToCopy>
				<a>
					<Share
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
}


export default ShareLink
