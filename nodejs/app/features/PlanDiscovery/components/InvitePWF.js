import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router'
import { routeActions } from 'react-router-redux'
import CustomScroll from 'react-custom-scroll'
import Immutable from 'immutable'
import CopyToClipboard from 'react-copy-to-clipboard'
import ButtonBar from '../../../components/ButtonBar'
import ShareIcon from '../../../components/Icons/ShareIcon'
import BubblesIcon from '../../../components/Icons/BubblesIcon'
import ListIcon from '../../../components/Icons/ListIcon'
import Search from '../../../components/Search'
import User from '../../../components/User'
import CheckMark from '../../../components/CheckMark'
import ClickTarget from '../../../components/ClickTarget'
import Share from '../../../features/Bible/components/verseAction/share/Share'
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
			showCircleView: false,
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
		this.setState({
			query,
			showSearchResults: true,
		})
		handleSearch(query)

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
			dispatch(routeActions.push(Routes.subscriptions({ username: auth.userData.username })))
		}
	}

	handleListToggle = (view) => {
		// const { showCircleView } = this.state
		//
		// const updateCircleView = (view.value === 'circle')
		// // don't bother updating state if we're showing the same thing
		// if (showCircleView !== (updateCircleView)) {
		// 	this.setState({
		// 		showCircleView: updateCircleView,
		// 	})
		// }
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
		const { search, friends, shareLink } = this.props
		const { query, showSearchResults, selectedFriends } = this.state

		const selectedUsers = selectedFriends.toJS()

		let searchResults = null
		if (showSearchResults && search) {
			searchResults = (
				<ClickTarget handleOutsideClick={this.hideSearchResults}>
					<div className='search-results'>
						<CustomScroll allowOutsideScroll={false}>
							<div className='friend-list'>
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

		const friendsList = friends || []
		// merge together selected users with the friends list, to add selected users
		// from search to the friends list. the set will remove duplicates
		const mergedUsers = Array.from(new Set(friendsList.concat(selectedUsers)))

		let backLink = ''
		if (typeof window !== 'undefined') {
			backLink = `${window.location.pathname.replace('invite', 'create')}`
		}

		return (
			<div className='pwf-flow pwf-invite row'>
				<div className='reading_plan_index_header columns medium-8 small-12 small-centered'>
					<div className='row'>
						<Link
							className='plans vertical-center columns medium-4'
							to={backLink}
						>
							&larr;
						</Link>
						<h4 className='text-center columns medium-4'>Invite Friends</h4>
						<div className='columns medium-4 text-right'>
							<a tabIndex={0} className='solid-button green' onClick={this.handleInvite}>Do stuff</a>
						</div>
					</div>
				</div>
				<div className='gray-background content' style={{ minHeight: '450px' }}>
					<div className='columns medium-5 small-12 small-centered '>
						{/* <div className='horizontal-center' style={{ marginBottom: '20px' }}>
							<ButtonBar
								items={[
									{ value: 'circle', label: <BubblesIcon /> },
									{ value: 'list', label: <ListIcon /> },
								]}
								initialValue='list'
								onClick={this.handleListToggle}
							/>
						</div> */}
						<div className='horizontal-center vertical-center'>
							<div className='selected-number'>{ selectedUsers.length }</div>
							Selected
						</div>
						<div className='users'>
							<div>
								<Search
									onHandleSearch={this.handleSearch}
									placeholder='Search...'
									customClass='row-reverse'
								/>
								<div style={{ position: 'relative' }}>
									{
											showSearchResults && !search ?
												<div>Loading...</div> :
												searchResults
										}
								</div>
								<CustomScroll>
									{
										!friends ?
											<div>Loading...</div> :
											<div className='friend-list'>
												{
													mergedUsers.map((user) => {
														return this.renderUser(user)
													})
												}
											</div>
										}
								</CustomScroll>
							</div>
						</div>
					</div>
				</div>
				<div className='columns medium-8 small-12 small-centered' style={{ padding: '25px 0' }}>
					<div className='text-center'>Or, use this link yall</div>
					<div className='vertical-center horizontal-center'>
						<CopyToClipboard className='pointer share-link yv-text-ellipsis' text={shareLink}>
							<div onClick={() => { alert('copied!') }}>{ shareLink }</div>
						</CopyToClipboard>
						<a>
							<Share
								url={shareLink}
								button={
									<ShareIcon />
								}
							/>
						</a>
					</div>
				</div>
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
