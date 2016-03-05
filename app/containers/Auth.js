import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { Link } from 'react-router'
import Row from '../components/Row'
import Column from '../components/Column'
import FormField from '../components/FormField'
import Input from '../components/Input'
import ActionCreators from '../features/Auth/actions/creators'
import NoticeBanner from '../components/NoticeBanner'
import EventHeader from '../components/EventHeader'

class Auth extends Component {

	handleChange(changeEvent) {
		const { dispatch } = this.props
		dispatch(ActionCreators.setField({
			field: changeEvent.target.name,
			value: changeEvent.target.value
		}))
	}

	handleLogin(clickEvent) {
		const { dispatch, auth } = this.props
		dispatch(ActionCreators.authenticate({
			user: auth.user,
			password: auth.password
		}))
	}

	handleKeyPress(keyEvent) {
		if (keyEvent.key === 'Enter') {
			const login = ::this.handleLogin
			setTimeout(login, 500)
		}
	}

	render() {
		const { hasError, errors, isFetching, auth } = this.props

		let error = null
		if (typeof auth.errors.api === 'string') {
			error = (
				<div className='alert-box secondary'>
					{auth.errors.api}
				</div>
			)
		}

		return (
			<div className="medium-6 large-5 columns small-centered auth">
				<Helmet title="My Events" />
				<EventHeader {...this.props} />
				<div className='form-body'>
					<NoticeBanner />
					<h1>Sign In</h1>
					<p className="auth__subhead">
					If you are a Bible App user and you already have a YouVersion account, you can sign in using your same credentials.<br/>
					<br/>
					Don’t have a YouVersion account yet? <br/>
					<a href="https://www.bible.com/sign-up?redirect=events-admin"> Sign up now at Bible.com</a> to start creating Events.
					</p>

					<div className="form-body-block white">
						{error}
						<FormField
							InputType={Input}
							placeholder="Email"
							name="user"
							onChange={::this.handleChange}
							value={auth.user}
							errors={auth.errors.fields.user}
							onKeyPress={::this.handleKeyPress} />

						<FormField
							InputType={Input}
							placeholder="Password"
							name="password"
							type="password"
							onChange={::this.handleChange}
							value={auth.password}
							errors={auth.errors.fields.password}
							onKeyPress={::this.handleKeyPress} />

						<a className='solid-button green' onClick={::this.handleLogin}>Sign In</a>
						<a className='forgot-password' href="https://www.bible.com/settings/forgot_password">Forgot Password</a>
					</div>
				</div>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		auth: state.auth
	}
}

export default connect(mapStateToProps, null)(Auth)
