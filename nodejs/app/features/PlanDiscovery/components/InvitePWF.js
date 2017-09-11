import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router'
import { push } from 'react-router-redux'
import CustomScroll from 'react-custom-scroll'
import Immutable from 'immutable'
import { FormattedMessage } from 'react-intl'
import Footer from '../../../components/Footer'
import ShareLink from '../../../components/ShareLink'
import Search from '../../../components/Search'
import User from '../../../components/User'
import CheckMark from '../../../components/CheckMark'
import ClickTarget from '../../../components/ClickTarget'
import SectionedHeading from '../../../components/SectionedHeading'
import List from '../../../components/List'
import Placeholder from '../../../components/placeholders/MediaListItemPlaceholder'
import Routes from '../../../lib/routes'
import { selectImageFromList } from '../../../lib/imageUtil'


function getFriendIndex(list, user) {
	if (list && list.size > 0) {
		return list.findIndex((selectedFriend) => {
			return selectedFriend.id === user.id
		})
	} else {
		return -1
	}
}

class InvitePWF extends Component {

	constructor(props) {
		super(props)

		this.state = {
			query: null,
			showSearchResults: false,
			selectedFriends: Immutable.List(),
		}
	}

	onUserClick = (user) => {
		const { selectedFriends } = this.state

		const isAlreadySelected = (getFriendIndex(selectedFriends, user) !== -1)
		if (isAlreadySelected) {
			this.unselectFriend(user)
		} else {
			this.selectFriend(user)
		}
	}

	hideSearchResults = () => {
		this.setState({
			showSearchResults: false,
			query: null,
		})
	}

	handleSearch = (query) => {
		const { handleSearch } = this.props
		if (query) {
			this.setState({
				query,
				showSearchResults: true,
			})
			handleSearch(query)
		}
	}

	selectFriend = (user) => {
		const { selectedFriends } = this.state
		this.setState({
			selectedFriends: selectedFriends.push(user)
		})
	}
	unselectFriend = (user) => {
		const { selectedFriends } = this.state
		const toDeleteIndex = getFriendIndex(selectedFriends, user)
		if (toDeleteIndex !== -1) {
			this.setState({
				selectedFriends: selectedFriends.delete(toDeleteIndex)
			})
		}
	}

	handleInvite = () => {
		const { dispatch, auth, handleInvite } = this.props
		const { selectedFriends } = this.state
		if (selectedFriends.size > 0 && typeof handleInvite === 'function') {
			handleInvite(selectedFriends.map((friend) => { return { id: friend.id } }))
		} else {
			dispatch(push(Routes.subscriptions({ username: auth.userData.username })))
		}
	}

	renderUser = (friend) => {
		const { selectedFriends } = this.state
		const img = selectImageFromList({ images: friend.avatar.renditions, width: 50 })
		return (
			<div
				className='vertical-center item'
				key={friend.id}
			>
				<User
					avatarLetter={friend.name.charAt(0)}
					src={img.url}
					width={36}
					heading={friend.name}
					subheading={friend.source}
					onClick={this.onUserClick.bind(this, friend)}
				/>
				{
					selectedFriends &&
					getFriendIndex(selectedFriends, friend) !== -1 &&
					<CheckMark />
				}
			</div>
		)
	}

	render() {
		const { search, friends, getFriends, backLink, together_id } = this.props
		const { showSearchResults, selectedFriends } = this.state

		const selectedUsers = selectedFriends.toJS()

		let searchResults = null
		if (showSearchResults && search) {
			searchResults = (
				<ClickTarget handleOutsideClick={this.hideSearchResults}>
					<div className='search-results'>
						<CustomScroll allowOutsideScroll={false}>
							<div
								className='friend-list'
								style={{
									minHeight: '350px',
									maxHeight: '350px'
								}}
							>
								{
									search.map((user) => {
										return this.renderUser(user)
									})
								}
							</div>
						</CustomScroll>
					</div>
				</ClickTarget>
			)
		}

		const friendsList = (friends && friends.users) || []
		// merge together selected users with the friends list, to add selected users
		// from search to the friends list. the set will remove duplicates
		const mergedUsers = Array.from(new Set(selectedUsers.concat(friendsList)))

		return (
			<div className='pwf-flow pwf-invite'>
				<SectionedHeading>
					<FormattedMessage id='invite friends' />
				</SectionedHeading>
				<div className='gray-background content' style={{ minHeight: '450px' }}>
					<div className='columns medium-5 small-12 small-centered '>
						<div className='horizontal-center vertical-center'>
							<div
								className={[
									'selected-number',
									`${
										selectedUsers
										&& selectedUsers.length > 150
										? 'red'
										: ''
									}`,
								].join(' ')}
							>
								{ selectedUsers.length }
							</div>
							<FormattedMessage id='selected' />
						</div>
						<div className='users'>
							<div>
								<Search
									onHandleSearch={this.handleSearch}
									onChange={(val) => {
										if (val.length < 1) {
											this.hideSearchResults()
										}
									}}
									placeholder='Search...'
									customClass='row-reverse'
								/>
								<div style={{ position: 'relative' }}>
									{ showSearchResults && searchResults }
								</div>
								<CustomScroll>
									<List
										customClass='friend-list'
										loadMore={getFriends.bind(this, friends && friends.next_page)}
										style={{
											minHeight: '350px',
											maxHeight: '350px'
										}}
									>
										{
											!friends
												? (
													<Placeholder
														key='friends-placeholder'
														height='38px'
														width='38px'
														borderRadius='38'
														duplicate={15}
														lineSpacing='16px'
														textHeight='10px'
														widthRange={[30, 60]}
													/>
												)
												: mergedUsers.map((user) => {
													return this.renderUser(user)
												})
										}
									</List>
								</CustomScroll>
							</div>
						</div>
					</div>
				</div>
				<ShareLink together_id={together_id} />
				<Footer>
					<a
						tabIndex={0}
						className='solid-button green margin-left-auto'
						onClick={this.handleInvite}
						style={{ marginBottom: 0 }}
					>
						<FormattedMessage id='done' />
					</a>
				</Footer>
			</div>
		)
	}
}

InvitePWF.propTypes = {
	friends: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
	search: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
	handleInvite: PropTypes.func,
	handleSearch: PropTypes.func,
}

InvitePWF.defaultProps = {
	handleInvite: null,
	handleSearch: null,
}

export default InvitePWF
