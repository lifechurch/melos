import React, { PropTypes } from 'react'
import getProportionalSize from '../../../utils/imageProportions'

function Google({ width, height, className }) {
  const {
		height: finalHeight,
		width: finalWidth
	} = getProportionalSize({
  defaultHeight: Google.defaultProps.height,
  defaultWidth: Google.defaultProps.width,
  newHeight: height,
  newWidth: width
})

  return (
    <svg
      className={className}
      width={finalWidth}
      height={finalHeight}
      viewBox="0 0 24 25"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs />
      <g fill="none" fillRule="evenodd">
        <g>
          <mask id="b" fill="#fff">
            <path id="a" d="M23.72 10.227H12.28v4.83h6.585c-.614 3.068-3.181 4.83-6.586 4.83-4.019 0-7.256-3.296-7.256-7.387 0-4.09 3.237-7.386 7.256-7.386 1.73 0 3.293.625 4.521 1.647l3.572-3.636C18.195 1.193 15.405 0 12.28 0 5.47 0 0 5.568 0 12.5S5.47 25 12.28 25C18.418 25 24 20.455 24 12.5c0-.739-.112-1.534-.28-2.273z" />
          </mask>
          <path fill="#FBBC05" fillRule="nonzero" d="M-1.116 19.886V5.114L8.372 12.5z" mask="url(#b)" />
        </g>
        <g>
          <mask id="d" fill="#fff">
            <path id="c" d="M23.72 10.227H12.28v4.83h6.585c-.614 3.068-3.181 4.83-6.586 4.83-4.019 0-7.256-3.296-7.256-7.387 0-4.09 3.237-7.386 7.256-7.386 1.73 0 3.293.625 4.521 1.647l3.572-3.636C18.195 1.193 15.405 0 12.28 0 5.47 0 0 5.568 0 12.5S5.47 25 12.28 25C18.418 25 24 20.455 24 12.5c0-.739-.112-1.534-.28-2.273z" />
          </mask>
          <path fill="#EA4335" fillRule="nonzero" d="M-1.116 5.114L8.372 12.5l3.907-3.466 13.395-2.216v-7.954h-26.79z" mask="url(#d)" />
        </g>
        <g>
          <mask id="f" fill="#fff">
            <path id="e" d="M23.72 10.227H12.28v4.83h6.585c-.614 3.068-3.181 4.83-6.586 4.83-4.019 0-7.256-3.296-7.256-7.387 0-4.09 3.237-7.386 7.256-7.386 1.73 0 3.293.625 4.521 1.647l3.572-3.636C18.195 1.193 15.405 0 12.28 0 5.47 0 0 5.568 0 12.5S5.47 25 12.28 25C18.418 25 24 20.455 24 12.5c0-.739-.112-1.534-.28-2.273z" />
          </mask>
          <path fill="#34A853" fillRule="nonzero" d="M-1.116 19.886L15.628 6.818l4.41.568 5.636-8.522v27.272h-26.79z" mask="url(#f)" />
        </g>
        <g>
          <mask id="h" fill="#fff">
            <path id="g" d="M23.72 10.227H12.28v4.83h6.585c-.614 3.068-3.181 4.83-6.586 4.83-4.019 0-7.256-3.296-7.256-7.387 0-4.09 3.237-7.386 7.256-7.386 1.73 0 3.293.625 4.521 1.647l3.572-3.636C18.195 1.193 15.405 0 12.28 0 5.47 0 0 5.568 0 12.5S5.47 25 12.28 25C18.418 25 24 20.455 24 12.5c0-.739-.112-1.534-.28-2.273z" />
          </mask>
          <path fill="#4285F4" fillRule="nonzero" d="M25.674 26.136L8.372 12.5 6.14 10.795l19.534-5.681z" mask="url(#h)" />
        </g>
      </g>
    </svg>
  )
}

Google.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  className: PropTypes.string
}

Google.defaultProps = {
  width: 24,
  height: 25,
  className: ''
}

export default Google
