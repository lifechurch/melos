import React from 'react'
import PropTypes from 'prop-types'
import selectImageFromList from '@youversion/utils/lib/images/selectImageFromList'
import { SQUARE } from '@youversion/utils/lib/images/readingPlanDefault'
import LazyImage from '@youversion/melos/dist/components/images/LazyImage'
import Link from '@youversion/melos/dist/components/links/Link'
import withImages from '@youversion/api-redux/lib/endpoints/images/hocs/withImages'

function withLazyImages(WrappedComponent) {
	function LazyImages(props) {
		const { images, imgWidth, imgHeight, hiRes, linkBuilder, usfm, alt } = props

		return (
			<WrappedComponent {...props}>
				{
					images
          && images.map((img) => {
	const src = selectImageFromList({
		images: img.renditions,
		width: hiRes ? imgWidth * 2 : imgWidth,
		height: hiRes ? imgHeight * 2 : imgHeight,
	}).url
	const lazyImg = (
		<div className='horizontal-center' key={img.id}>
			<LazyImage
				alt={alt}
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
	<Link key={img.id} to={linkBuilder({ id: img.id, usfm })}>
		{ lazyImg }
	</Link>
									)
									: lazyImg
	)
})
				}
			</WrappedComponent>
		)
	}

	LazyImages.propTypes = {
		images: PropTypes.array,
		imgHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		imgWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		hiRes: PropTypes.bool,
		linkBuilder: PropTypes.func,
		usfm: PropTypes.array,
		alt: PropTypes.string
	}

	LazyImages.defaultProps = {
		images: null,
		imgHeight: 'auto',
		imgWidth: 320,
		hiRes: true,
		linkBuilder: null,
		usfm: null,
		alt: null
	}

	return withImages(LazyImages)
}

export default withLazyImages
