import React from 'react'
import PropTypes from 'prop-types'
import ButtonMajor from '../../links/ButtonMajor'
import GoogleIcon from '../../logos/Google'
import Avatar from '../../user/Avatar'
import withGoogle from '../hocs/withGoogle'

function Google(props) {
  const {
    givenName,
    avatarUrl,
    token,
    onLogin
  } = props

  const placeholderText = (givenName && givenName[0].toUpperCase()) || ''

  return (
    <ButtonMajor
      disabled={!token}
      color="#FFFFFF"
      textColor="#000000"
      left={<GoogleIcon height={24} />}
      onClick={onLogin}
      right={placeholderText && <Avatar placeholderText={placeholderText} src={avatarUrl} width={30} />}
    >
      { givenName ? `Continue as ${givenName}` : 'Continue with Google' }
    </ButtonMajor>
  )
}

Google.propTypes = {
  onLogin: PropTypes.func,
  givenName: PropTypes.string,
  avatarUrl: PropTypes.string,
  token: PropTypes.string
}

Google.defaultProps = {
  onLogin: null,
  givenName: null,
  avatarUrl: null,
  token: null
}

export default withGoogle(Google)
