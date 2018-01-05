import React, { PropTypes } from 'react'
import withVotd from '@youversion/api-redux/lib/endpoints/moments/hocs/withVotd'
import Grid from '../components/Grid'


function VerseImagesGrid(props) {
	const { votd, children } = props

	if (!votd || (votd.length === 0)) return null
	return (
		<Grid className='verse-images-grid' lgCols={3} medCols={3} smCols={2}>
			{
				votd && votd.map((day) => {
					return (
						day.image_id
					)
				})
			}
		</Grid>
	)
}

/* eslint-disable react/no-unused-prop-types */
VerseImagesGrid.propTypes = {
	images: PropTypes.array,
	imgHeight: PropTypes.number,
	imgWidth: PropTypes.number,
	hiRes: PropTypes.bool,
	linkBuilder: PropTypes.func,
	children: PropTypes.any,
}

VerseImagesGrid.defaultProps = {
	images: null,
	imgHeight: 'auto',
	imgWidth: 320,
	hiRes: true,
	linkBuilder: null,
	children: null,
}

export default withVotd(VerseImagesGrid)
