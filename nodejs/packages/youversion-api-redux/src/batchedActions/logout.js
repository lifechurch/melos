import Routes from '@youversion/utils/lib/routes/routes'
import cookie from 'react-cookie'

function logout(locale) {
	return (dispatch) => {
		cookie.remove('YouVersionToken2', { path: '/' })
		cookie.remove('OAUTH', { path: '/' })
		dispatch({ type: 'LOGOUT' })
		if (window && typeof window !== 'undefined') {
			window.location.replace(`/${locale}${Routes.signIn({})}`)
		}
	}
}

export default logout
