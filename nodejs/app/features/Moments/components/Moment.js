import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { routeActions } from 'react-router-redux'
import { FormattedMessage } from 'react-intl'
// actions
import planView from '@youversion/api-redux/lib/batchedActions/planView'
import plansAPI, { getTogether } from '@youversion/api-redux/lib/endpoints/plans'
// models
import getTogetherModel from '@youversion/api-redux/lib/models/together'
import { getParticipantsUsersByTogetherId } from '@youversion/api-redux/lib/models'
// selectors
import { getUsers } from '@youversion/api-redux/lib/endpoints/users/reducer'
// utils
import { selectImageFromList } from '../../../lib/imageUtil'
import Routes from '../../../lib/routes'
import getCurrentDT from '../../../lib/getCurrentDT'
// components
import ParticipantsAvatarList from '../../../widgets/ParticipantsAvatarList'
import List from '../../../components/List'
import Card from '../../../components/Card'
import Textarea from '../../../components/Textarea'
import Avatar from '../../../components/Avatar'
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
			likes,
			filledLike,
			onLike,
			onDelete,
			onEdit,
			users,
		} = this.props

		const user = 	userid &&
										userid in users ?
										users[userid].response :
										null

		const avatarSrc = user &&
											user.has_avatar &&
											user.user_avatar_url ?
											user.user_avatar_url.px_48x48 :
											null


		return (
			<Card customClass='moment-card'>
				<div className='aside-col'>
					{
						userid &&
							<Avatar
								src={avatarSrc}
								width={38}
								placeholderText={user && user.first_name ? user.first_name.charAt(0) : null}
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
					<MomentFooter
						likes={likes}
						filledLike={filledLike}
						onLike={onLike}
						onReply={null}
						onEdit={this.isAuthedMoment ? onEdit : null}
						onDelete={this.isAuthedMoment ? onDelete : null}
					/>
				</div>
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
	likes: PropTypes.number,
	filledLike: PropTypes.bool,
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
	likes: null,
	filledLike: null,
	onEdit: null,
	users: null,
	auth: null,
}

export default connect(mapStateToProps, null)(Moment)
