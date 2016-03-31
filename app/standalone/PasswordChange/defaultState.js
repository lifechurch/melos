export default {
	auth: {
		token: null,
		isLoggedIn: false,
		isWorking: false,
		userData: {
			first_name: null,
			last_name: null,
			email: null,
			language_tag: null,
			timezone: null
		},
		user: null,
		password: null,
		errors: {
			api: null,
			fields: {
				user: null,
				password: null
			}
		}
	},
	Password: {
		apiToken: null,
		newPassword: null,
		newPasswordVerify: null,
		errors: []
	}
}