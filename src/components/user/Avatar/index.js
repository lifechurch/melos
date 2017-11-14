import React, { PropTypes } from 'react'
import { Div } from 'glamorous'
import LazyImage from '../../images/LazyImage'
import Link from '../../links/Link'

function Avatar(props) {
  const { placeholderText, src, width, link, onClick } = props

  const placeholder = (
    <Div
      borderRadius="100%"
      width={width}
      height={width}
      fontSize={`${width / 2.4}px`}
      display="flex"
      alignItems="center"
      justifyContent="center"
      color="#777777"
    >
      {placeholderText}
    </Div>
	)

  const img = (
    <LazyImage
      alt='avatar'
      src={src}
      width={width}
      height={width}
      placeholder={placeholder}
      borderRadius="100%"
    />
  )

  return (
    <Link
      href={link}
      onClick={onClick}
    >
      <Div
        display="inline-flex"
        alignItems="center"
      >
        {img}
      </Div>
    </Link>
  )
}

Avatar.propTypes = {
  placeholderText: PropTypes.string,
  src: PropTypes.string.isRequired,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  link: PropTypes.string,
  onClick: PropTypes.func
}

Avatar.defaultProps = {
  placeholderText: '',
  width: 48,
  link: null,
  onClick: null
}

export default Avatar
