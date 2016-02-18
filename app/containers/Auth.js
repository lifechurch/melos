import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { Link } from 'react-router'
import Row from '../components/Row'
import Column from '../components/Column'
import FormField from '../components/FormField'
import Input from '../components/Input'
import ActionCreators from '../features/Auth/actions/creators'

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

	render() {
		const { hasError, errors, isFetching, auth } = this.props

		return (
			<div className="medium-6 large-5 columns small-centered">
				<Helmet title="My Events" />
				<div className='form-body'>
					<div className="form-body-block white">
						<FormField
							InputType={Input}
							placeholder="Email"
							name="user"
							onChange={::this.handleChange}
							value={auth.user}
							errors={auth.errors.fields.user} />

						<FormField
							InputType={Input}
							placeholder="Password"
							name="password"
							type="password"
							onChange={::this.handleChange}
							value={auth.password}
							errors={auth.errors.fields.password} />

						<a className='solid-button green' onClick={::this.handleLogin}>Login</a>
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
