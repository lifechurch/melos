import React, { PropTypes } from 'react'
import selectImageFromList from '@youversion/utils/lib/images/selectImageFromList'
import PLAN_DEFAULT from '@youversion/utils/lib/images/readingPlanDefault'
import withImages from '@youversion/api-redux/lib/endpoints/images/hocs/withImages'
import LazyImage from '../components/LazyImage'
import Slider from '../components/Slider'


function VerseImagesSlider(props) {
	const { images, imgWidth, imgHeight } = props

	if (!images || (images.length === 0)) return null
	return (
		<Slider>
			{
				images
					&& images.map((img) => {
						const src = selectImageFromList({
							images: img.renditions,
							width: imgWidth * 2,
							height: imgHeight * 2,
						}).url
						return (
							<LazyImage
								key={img.id}
								src={src}
								placeholder={<img alt='Default Placeholder' src={PLAN_DEFAULT} />}
								width={imgWidth}
								height={imgHeight}
							/>
						)
					})
			}
		</Slider>
	)
}

VerseImagesSlider.propTypes = {
	images: PropTypes.array,
	imgHeight: PropTypes.number,
	imgWidth: PropTypes.number
}

VerseImagesSlider.defaultProps = {
	images: null,
	imgHeight: 320,
	imgWidth: 320,
}

export default withImages(VerseImagesSlider)
