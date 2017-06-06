import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import FormField from '../../../components/FormField'
import Input from '../../../components/Input'
import ActionCreators from '../actions/creators'

function makeErrorMessage(key, strings) {
	if (key.lastIndexOf('users.password.less_than_minimum',0) === 0) {
		return strings['api.users password length']
	} else if (key === 'users.same_password.change') {
		return strings['api.users password change']
	} else if (key === 'users.password.invalid' || key === 'users.password.more_than_maximum_value_32') {
		return strings['api.users username or password invalid']
	} else if (key === 'users.password no match') {
		return strings['api.users confirm password matches']
	} else if (key === 'users.user_verification_token.invalid') {
		return <span>{strings['mobile page.sms error']} <a href='/settings/forgot_password'>{strings['app errors.try again']}</a></span>
	} else {
		return <span>{strings['mobile page.sms error']} ({key}) <a href='/settings/forgot_password'>{strings['app errors.try again']}</a></span>
	}
}

class PasswordChange extends Component {
	constructor(props) {
		super(props)
		this.state = { userReadyToVerify: false, firstLoad: true, success: false, error: [] }
	}

	handleClick(clickEvent) {
		const { dispatch, password } = this.props

		this.setState({ userReadyToVerify: true, error: [], success: false })

		if (password.newPassword !== null && password.newPassword === password.newPasswordVerify) {
			dispatch(ActionCreators.passwordChange({ password: password.newPassword, token: password.apiToken })).then((resp) => {
				const { errors } = resp
				if (typeof errors === 'undefined') {
					this.setState({ success: true, error: [] })
				} else {
					this.setState({ success: false, error: errors })
				}
			}, (error) => {
				this.setState({ success: false, error: [{ key: error }] })
			})
		}
	}

	handleChange(changeEvent) {
		const { dispatch } = this.props
		const { name, value } = changeEvent.target
		this.setState({ firstLoad: false })
		dispatch(ActionCreators.passwordSetField({ name, value }))
	}

	handleKeyPress(keyEvent) {
		if (keyEvent.key === 'Enter') {
			::this.handleClick()
		}
	}

	render() {
		const { password } = this.props
		const { userReadyToVerify, firstLoad, success, error } = this.state
		const verifyDisabled = typeof password.newPassword !== 'string' || password.newPassword.length === 0
		const verifyMismatch = password.newPassword !== password.newPasswordVerify
		const verifyMismatchError = verifyMismatch && typeof password.newPasswordVerify === 'string' && password.newPasswordVerify.length > 0
		const submitDisabled = verifyDisabled || typeof password.newPasswordVerify !== 'string' || password.newPasswordVerify.length === 0

		const errorMessages = error.map((e, i) => {
			return <li key={i} className='error'>{makeErrorMessage(e.key, password.strings)}</li>
		})

		if (userReadyToVerify && verifyMismatchError) {
			errorMessages.push(<li key='mismatch' className='error'>{makeErrorMessage('users.password no match', password.strings)}</li>)
		}

		return (
			<div className='row'>
				<div className='medium-7 medium-centered columns'>
					<h1>{password.strings['users.my password']}</h1>
					<p className='terms'>{password.strings['users.forgot password prompt']}</p>
					<br/>
					<div>
						<label htmlFor='newPassword'>{password.strings['users.profile.new password']}</label>
						<input
							id='newPassword'
							tabIndex='1'
							type='password'
							name='newPassword'
							onChange={::this.handleChange}
							value={password.newPassword}
							ref={function() {
								if (firstLoad) {
									document.getElementById('newPassword').focus()
								}
							}}
							disabled={success} />
					</div>
					<div>
						<label htmlFor='newPasswordVerify'>{password.strings['users.profile.confirm password']}</label>
						<input
							id='newPasswordVerify'
							tabIndex='2'
							type='password'
							name='newPasswordVerify'
							onChange={::this.handleChange}
							value={password.newPasswordVerify}
							disabled={verifyDisabled || success}
							onKeyPress={::this.handleKeyPress} />
					</div>
					{ userReadyToVerify ? <div className='form_errors'><ul className='no-bullet error'>{errorMessages}</ul></div> : null }
					{ success ?
						<div>{password.strings['users.password updated']} <a href='/sign-in'>{password.strings['sign in']}</a></div> :
						<div>
							<a
								tabIndex='3'
								disabled={submitDisabled}
								className='solid-button green'
								onClick={::this.handleClick}>
								{password.strings['users.my password']}
							</a>
							<div className='right'>
								{password.strings['users.password length']}
							</div>
						</div>
					}
				</div>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		password: state.Password
	}
}

export default connect(mapStateToProps, null)(PasswordChange)