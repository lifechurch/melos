import React from 'react'
import PropTypes from 'prop-types'
import { Div } from 'glamorous'
import Avatar from '../Avatar'
import Heading3 from '../../typography/Heading3'
import Caption1 from '../../typography/Caption1'
import Link from '../../links/Link'

function User(props) {
  const {
     avatarLetter,
     avatarSrc,
     avatarWidth,
     link,
     heading,
     subheading,
     onClick,
     children,
     className
   } = props

  const avatar = <Avatar placeholderText={avatarLetter} src={avatarSrc} width={avatarWidth} />
  const headingContent = <Heading3>{ heading }</Heading3>
  const subHeadingContent = <Caption1 muted={true}>{ subheading }</Caption1>

  return (
    <Link href={link} onClick={onClick} className={`yv-user-container ${className}`}>
      <Div display="inline-flex">
        {avatar}
        <Div
          padding="0 10px"
          flexDirection="column"
          display="flex"
          alignItems="start"
          justifyContent="center"
        >
          {headingContent}
          {subHeadingContent}
          {children}
        </Div>
      </Div>
    </Link>
  )
}

User.propTypes = {
  avatarLetter: PropTypes.string.isRequired,
  avatarSrc: PropTypes.string.isRequired,
  avatarWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  link: PropTypes.string,
  onClick: PropTypes.func,
  heading: PropTypes.string,
  subheading: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string
}

User.defaultProps = {
  className: '',
  avatarWidth: 46,
  link: null,
  heading: null,
  subheading: null,
  children: null,
  onClick: null
}

export default User
