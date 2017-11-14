import React from 'react'
import PropTypes from 'prop-types'
import withFacebook from '../hocs/withFacebook'
import ButtonMajor from '../../links/ButtonMajor'
import FacebookInverted from '../../logos/FacebookInverted'
import Avatar from '../../user/Avatar'

function Facebook(props) {
  const {
		buttonDisabled,
		profileEmpty,
		avatarUrl,
		name,
    onLogin
	} = props

  const placeholderText = (name && name[0].toUpperCase()) || ''
  const [ firstName ] = typeof name === 'string' ? name.split(' ') : []

  return (
    <ButtonMajor
      disabled={buttonDisabled}
      color="#3B5998"
      onClick={onLogin}
      left={<FacebookInverted fill="#FFFFFF" height={24} />}
      right={!profileEmpty && <Avatar placeholderText={placeholderText} src={avatarUrl} width={30} />}
    >
      { profileEmpty ? 'Continue with Facebook' : `Continue as ${firstName}` }
    </ButtonMajor>
  )
}

Facebook.propTypes = {
  onLogin: PropTypes.func,
  buttonDisabled: PropTypes.bool,
  profileEmpty: PropTypes.bool,
  avatarUrl: PropTypes.string,
  name: PropTypes.string
}

Facebook.defaultProps = {
  onLogin: null,
  buttonDisabled: true,
  profileEmpty: true,
  avatarUrl: null,
  name: null
}

export default withFacebook(Facebook)
