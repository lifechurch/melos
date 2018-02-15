import React from 'react'
import PropTypes from 'prop-types'
import getProportionalSize from '@youversion/utils/lib/images/imageProportions'

function FacebookInverted({ width, height, fill, className }) {
  const {
		height: finalHeight,
		width: finalWidth
	} = getProportionalSize({
  defaultHeight: FacebookInverted.defaultProps.height,
  defaultWidth: FacebookInverted.defaultProps.width,
  newHeight: height,
  newWidth: width
})

  return (
    <svg
      className={className}
      width={finalWidth}
      height={finalHeight}
      viewBox="0 0 24 24"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fill={fill} fillRule="evenodd" d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.35C0 23.407.593 24 1.325 24h11.494v-9.294H9.691v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.324 0 2.463.098 2.795.143v3.24h-1.918c-1.504 0-1.795.715-1.795 1.763v2.313h3.586l-.467 3.622h-3.12V24h6.116c.732 0 1.325-.593 1.325-1.325V1.325C24 .593 23.407 0 22.675 0" />
    </svg>
  )
}

FacebookInverted.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.string,
  className: PropTypes.string
}

FacebookInverted.defaultProps = {
  width: 24,
  height: 24,
  fill: '#444444',
  className: ''
}

export default FacebookInverted
