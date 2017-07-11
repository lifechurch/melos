import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { routeActions } from 'react-router-redux'
import { FormattedMessage, injectIntl } from 'react-intl'
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


class Moment extends Component {
	constructor(props) {
		super(props)
		this.state = {

		}
	}

	// like or comment on this moment
	createChildMoment = () => {

	}

	render() {
		const {
			userid,
			title,
			dt,
			content,
			users,
			auth,
			intl
		} = this.props

		const user = 	userid &&
												userid in users ?
												users[userid] :
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
					<div className='moment-header'>
						<div className='title'>
							{ title }
						</div>
						{
							dt &&
							<div className='dt'>
								{ moment(dt).fromNow() }
							</div>
						}
					</div>
					<div className='content'>
						{ content }
					</div>
				</div>
			</Card>
		)
	}
}


function mapStateToProps(state, props) {
	return {
		users: getUsers(state),
		auth: state.auth,
	}
}

Moment.propTypes = {
	title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
	dt: PropTypes.string,
	content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
}

Moment.defaultProps = {
	title: null,
	dt: null,
	content: null,
}

export default connect(mapStateToProps, null)(injectIntl(Moment))
