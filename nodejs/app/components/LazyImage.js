import React, { Component, PropTypes } from 'react'
import WayPoint from 'react-waypoint'
import imgLoaded from '@youversion/utils/lib/images/imgLoaded'


class LazyImage extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loaded: !!(this.img && imgLoaded(this.img)),
			// if we don't want lazy loading, we need to load immediately
			needsLoading: !props.lazy
		}
	}

	componentDidMount() {
		this.showImgIfNeeded()
	}

	componentDidUpdate() {
		this.showImgIfNeeded()
	}

	handleLoadImg = () => {
		const { loaded } = this.state
		if (!loaded) {
			// tell the img to actually load the src url
			// if we're lazy loading, this is false until the image enters the viewport
			this.setState({ needsLoading: true })
		}
	}

	showImgIfNeeded = () => {
		const { loaded } = this.state
		// we need to check this in case the img is already downloaded
		// and the onload doesn't fire
		if (!loaded && this.img && imgLoaded(this.img)) {
			this.setState({ loaded: true, needsLoading: false })
		}
	}

	render() {
		const {
			placeholder,
			src,
			lazy,
			width,
			height,
			customClass,
			imgClass,
			alt,
			style,
			crossOrigin
		} = this.props
		const { loaded, needsLoading } = this.state

		const imgDiv = (
			<img
				ref={(img) => { this.img = img }}
				onLoad={() => { this.showImgIfNeeded() }}
				className={`large ${loaded ? 'loaded' : ''} ${imgClass}`}
				alt={alt}
				src={(needsLoading || loaded) ? src : null}
				width={width}
				height={height}
				style={style}
				crossOrigin={crossOrigin}
			/>
		)

		const content = (
			placeholder
				? (
					<div
						className={`placeholder ${customClass}`}
						style={{
							width: typeof width === 'string' ? width : `${width}px`,
							height: typeof height === 'string' ? height : `${height}px`,
							backgroundColor: placeholder ? 'transparent' : 'lightGray'
						}}
					>
						{ placeholder }
						{ imgDiv }
					</div>
				)
				: imgDiv
		)

		return (
			lazy
				? (
					<WayPoint onEnter={this.handleLoadImg} fireOnRapidScroll={false}>
						{ content }
					</WayPoint>
				)
				: content
		)
	}
}

LazyImage.propTypes = {
	placeholder: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
	lazy: PropTypes.bool,
	src: PropTypes.string,
	alt: PropTypes.string,
	customClass: PropTypes.string,
	imgClass: PropTypes.string,
	width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	crossOrigin: PropTypes.string,
	style: PropTypes.object,
}

LazyImage.defaultProps = {
	placeholder: null,
	lazy: true,
	src: '',
	alt: '',
	customClass: '',
	imgClass: '',
	width: '100%',
	height: null,
	crossOrigin: null,
	style: null,
}

export default LazyImage
