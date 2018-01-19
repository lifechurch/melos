import React, { PropTypes } from 'react'
import withVotd from '@youversion/api-redux/lib/endpoints/moments/hocs/withVotd'
import { SQUARE } from '@youversion/utils/lib/images/readingPlanDefault'
import LazyImage from '@youversion/melos/dist/components/images/LazyImage'
import Link from '@youversion/melos/dist/components/links/Link'
import Grid from '../components/Grid'


function VerseImagesGrid(props) {
	const { votd, imgSrcTemplate, imgHeight, imgWidth, linkBuilder, hasVotdImages } = props

	if (!votd || (votd.length === 0) || !hasVotdImages) return null
	return (
		<Grid className='verse-images-grid' lgCols={3} medCols={3} smCols={2}>
			{
				votd && votd.map((day) => {
					if (!day.image_id) return null
					const src = imgSrcTemplate
						.replace('{0}', '320')
						.replace('{1}', '320')
						.replace('{image_id}', day.image_id)
					const lazyImg = (
						<div
							key={day.id}
							className='horizontal-center'
							style={{ margin: '0 2.5px 5px 2.5px' }}
						>
							<LazyImage
								src={src}
								placeholder={<img alt='Default Placeholder' src={SQUARE} />}
								width={imgWidth}
								height={imgHeight}
							/>
						</div>
					)
					return (
						linkBuilder
							? (
								<Link to={linkBuilder({ id: day.id, usfm: day.usfm })}>
									{ lazyImg }
								</Link>
							)
							: lazyImg
					)
				})
			}
		</Grid>
	)
}

/* eslint-disable react/no-unused-prop-types */
VerseImagesGrid.propTypes = {
	hasVotdImages: PropTypes.bool.isRequired,
	votd: PropTypes.array,
	imgSrcTemplate: PropTypes.string,
	imgHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	imgWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	linkBuilder: PropTypes.func,
}

VerseImagesGrid.defaultProps = {
	votd: null,
	imgSrcTemplate: null,
	imgHeight: 'auto',
	imgWidth: '100%',
	linkBuilder: null,
}

export default withVotd(VerseImagesGrid)
