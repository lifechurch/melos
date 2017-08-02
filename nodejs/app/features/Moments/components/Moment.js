import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
// actions
// models
// selectors
import { getUsers } from '@youversion/api-redux/lib/endpoints/users/reducer'
// utils
import Routes from '../../../lib/routes'
// components
import Card from '../../../components/Card'
import Avatar from '../../../components/Avatar'
import AvatarList from '../../../widgets/AvatarList'
import MomentHeader from './MomentHeader'
import MomentFooter from './MomentFooter'


class Moment extends Component {
	constructor(props) {
		super(props)
		const { userid, auth } = props
		this.state = {

		}

		this.isAuthedMoment = userid &&
			auth &&
			auth.userData &&
			userid === auth.userData.userid
	}

	render() {
		const {
			userid,
			title,
			dt,
			content,
			likedIds,
			onLike,
			onDelete,
			onEdit,
			users,
			auth,
		} = this.props

		const user = 	userid && userid in users
			? users[userid].response
			: null
		const avatarSrc = user && user.has_avatar && user.user_avatar_url
			? user.user_avatar_url.px_48x48
			: null
		const userLink = Routes.user({
			username: user && user.username,
		})
		const cardFooter = likedIds && likedIds.length > 0 ?
			(
				<div className='flex-wrap' style={{ width: '100%', padding: '0 17px' }}>
					<AvatarList userids={likedIds} avatarWidth={26} />
					{
						likedIds && likedIds.length > 0 &&
						<a className='font-grey margin-left-auto'>
							{ likedIds.length }
						</a>
					}
				</div>
			) :
			null


		return (
			<Card customClass='moment-card' extension={cardFooter}>
				<div style={{ display: 'flex', width: '100%' }}>
					<div className='aside-col'>
						{
							userid &&
							<Avatar
								src={avatarSrc}
								width={38}
								placeholderText={user && user.first_name ? user.first_name.charAt(0) : null}
								link={userLink}
							/>
						}
					</div>
					<div className='main-col'>
						{/* if we don't pass a title and do pass a userid, use the name */}
						<MomentHeader
							title={title || (user ? user.name : null)}
							dt={dt}
						/>
						<div className='content'>
							{ content }
						</div>
					</div>
				</div>
				<MomentFooter
					filledLike={likedIds && auth.userData && likedIds.includes(auth.userData.userid)}
					onLike={onLike}
					onEdit={this.isAuthedMoment ? onEdit : null}
					onDelete={this.isAuthedMoment ? onDelete : null}
				/>
			</Card>
		)
	}
}


function mapStateToProps(state) {
	return {
		users: getUsers(state),
		auth: state.auth,
	}
}

Moment.propTypes = {
	title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
	dt: PropTypes.string,
	content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
	onLike: PropTypes.func,
	onDelete: PropTypes.func,
	userid: PropTypes.number,
	likedIds: PropTypes.array,
	onEdit: PropTypes.func,
	users: PropTypes.object,
	auth: PropTypes.object,
}

Moment.defaultProps = {
	title: null,
	dt: null,
	content: null,
	onLike: null,
	onDelete: null,
	userid: null,
	likedIds: null,
	filledLike: null,
	onEdit: null,
	users: null,
	auth: null,
}

export default connect(mapStateToProps, null)(Moment)
