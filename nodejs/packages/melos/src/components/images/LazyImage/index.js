import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Div, Img } from 'glamorous'
import WayPoint from 'react-waypoint'
import imgLoaded from '@youversion/utils/lib/images/imgLoaded'

class LazyImage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: !!(this._img && imgLoaded(this._img)),
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
    if (!loaded && this._img && imgLoaded(this._img)) {
      this.setState({ loaded: true, needsLoading: false })
    }
  }

  render() {
    const {
      alt,
			placeholder,
			src,
			width,
			height,
			className,
			imgClass,
			crossOrigin,
			lazy,
      borderRadius
		} = this.props
    const { loaded, needsLoading } = this.state

    const imgDiv = (
      <Img
        ref={(img) => {
          if (img) {
            // hopefully the src prop is unique...
            const imgSrc = img.props && img.props.src
            this._img = imgSrc
            && document.querySelector(`img[src="${imgSrc}"]`)
          }
        }}
        onLoad={() => { this.showImgIfNeeded() }}
        position={placeholder ? 'absolute' : 'static'}
        top={0}
        left={0}
        transition="opacity 0.5s linear"
        src={(needsLoading || loaded) ? src : null}
        width={width}
        height={height}
        crossOrigin={crossOrigin}
        opacity={loaded ? 1 : 0}
        borderRadius={borderRadius}
        className={`large ${loaded ? 'loaded' : ''} ${imgClass}`}
        color="transparent"
        alt={alt}
      />
		)

    let content = imgDiv
    if (placeholder) {
      content = (
        <Div
          className={className}
          backgroundColor={placeholder ? 'transparent' : 'lightGray'}
          backgroundSize="cover"
          backgroundRepeat="no-repeat"
          position="relative"
          overflow="hidden"
          width={width}
          height={height}
        >
          { placeholder }
          { imgDiv }
        </Div>
      )
    }

    let lazyimg = content
    if (lazy) {
      lazyimg = (
        <WayPoint onEnter={this.handleLoadImg} fireOnRapidScroll={false}>
          { content }
        </WayPoint>
      )
    }

    return lazyimg
  }
}

LazyImage.propTypes = {
  alt: PropTypes.string,
  /**
   * Element (usually a default image) to show until
   * the src successfully downloads and covers it
   */
  placeholder: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  /**
   * Determines if the src should be loaded instantly (false) or
   * only when in the viewport (true)
   */
  lazy: PropTypes.bool,
  /**
   * Image src
   */
  src: PropTypes.string,
  /**
   * Class to apply to wrapper div if a placeholder is passed
   */
  className: PropTypes.string,
  /**
   * Class to apply to image element
   */
  imgClass: PropTypes.string,
  /**
   * Width of wrapper if placeholder is passed, and image
   */
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * Height of wrapper if placeholder is passed, and image
   */
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * CORS setting for retrieving image from foreign origins
   */
  crossOrigin: PropTypes.string,
  /**
   * Border radius for image
   */
  borderRadius: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
}

LazyImage.defaultProps = {
  alt: null,
  placeholder: null,
  lazy: true,
  src: '',
  className: '',
  imgClass: '',
  width: '100%',
  height: 'auto',
  crossOrigin: null,
  borderRadius: null,
}


export default LazyImage
