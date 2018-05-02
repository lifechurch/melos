import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { Link } from 'react-router'
import Row from '../components/Row'
import Column from '../components/Column'
import FormField from '../components/FormField'
import Input from '../components/Input'
import ActionCreators from '../features/Auth/actions/creators'
import EventHeader from '../components/EventHeader'
import { IntlProvider, injectIntl, FormattedMessage, FormattedHTMLMessage } from 'react-intl'

class Auth extends Component {

	handleChange(changeEvent) {
		const { dispatch } = this.props
		dispatch(ActionCreators.setField({
			field: changeEvent.target.name,
			value: changeEvent.target.value
		}))
	}

	handleLogin(clickEvent) {
		const { dispatch, auth, params } = this.props
		dispatch(ActionCreators.authenticate({
			user: auth.user,
			password: auth.password
		}, params.locale))
	}

	handleKeyPress(keyEvent) {
		if (keyEvent.key === 'Enter') {
			const login = ::this.handleLogin
			setTimeout(login, 500)
		}
	}

	render() {
		const { hasError, errors, isFetching, auth, intl } = this.props
		let error = null
		if (typeof auth.errors.api === 'string') {
			error = (
				<div className='alert-box secondary'>
					{intl.formatMessage({ id: auth.errors.api })}
				</div>
			)
		}

		return (
			<div className="medium-6 large-5 columns small-centered auth">
				<Helmet title={intl.formatMessage({ id: 'containers.Auth.title' })} />
				<EventHeader {...this.props} />
				<div className='form-body'>
					<FormattedMessage tagName="h1" id="containers.Auth.signIn" />
					<FormattedHTMLMessage tagName="p" className="auth__subhead" id="containers.Auth.subHead1" values={{ url: 'https://www.bible.com/sign-up?redirect=events-admin' }} />
					<div className="form-body-block white">
						{error}
						<FormField
							InputType={Input}
							placeholder={intl.formatMessage({ id: 'containers.Auth.email' })}
							name="user"
							onChange={::this.handleChange}
							value={auth.user}
							errors={auth.errors.fields.user}
							onKeyPress={::this.handleKeyPress}
						/>

						<FormField
							InputType={Input}
							placeholder={intl.formatMessage({ id: 'containers.Auth.password' })}
							name="password"
							type="password"
							onChange={::this.handleChange}
							value={auth.password}
							errors={auth.errors.fields.password}
							onKeyPress={::this.handleKeyPress}
						/>

						<a className='solid-button green' onClick={::this.handleLogin}><FormattedMessage id="containers.Auth.signIn" /></a>
						<a className='forgot-password' href="https://www.bible.com/settings/forgot_password"><FormattedMessage id="containers.Auth.forgotPassword" /></a>

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

export default connect(mapStateToProps, null)(injectIntl(Auth))
