import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
// actions
import usersAction from '@youversion/api-redux/lib/endpoints/users/action'
// selectors
import { getUsers } from '@youversion/api-redux/lib/endpoints/users/reducer'
// components
import User from '../components/User'


class AvatarList extends Component {
	componentDidMount() {
		const { users, userids, dispatch } = this.props
		// we could pass in users data or this will try and get it from users state
		if (userids) {
			userids.forEach((id) => {
				if (!(id in users)) {
					dispatch(usersAction({
						method: 'view',
						params: {
							id,
						},
					}))
				}
			})
		}
	}

	render() {
		const {
			users,
			userids,
			avatarWidth,
			customClass
		} = this.props

		const avatarList = []
		if (users && userids) {
			userids.forEach((userID) => {
				const user = users[userID].response
				const avatarSrc = user && user.user_avatar_url ? user.user_avatar_url.px_48x48 : ''

				avatarList.push(
					<div
						className='item'
						key={userID}
						// set the margin as a ratio of the width
						style={{
							marginRight: `${avatarWidth * 0.35}px`,
							display: 'flex',
							alignItems: 'flex-start'
						}}
					>
						<User
							avatarLetter={user.first_name ? user.first_name.charAt(0) : null}
							src={user && user.has_avatar ? avatarSrc : null}
							width={avatarWidth}
							link={null}
						/>
					</div>
				)
			})

		}

		return (
			<div className={`participants-list vertical-center ${customClass}`}>
				{ avatarList }
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		users: getUsers(state)
	}
}

AvatarList.propTypes = {
	userids: PropTypes.array.isRequired,
	users: PropTypes.object.isRequired,
	customClass: PropTypes.string,
	avatarWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	dispatch: PropTypes.func.isRequired,
}

AvatarList.defaultProps = {
	avatarWidth: 30,
	customClass: '',
}

export default connect(mapStateToProps, null)(AvatarList)
