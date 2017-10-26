import React, { PropTypes, Component } from 'react'
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
import SectionedLayout from '../../../components/SectionedLayout'
import List from '../../../components/List'
import Placeholder from '../../../components/placeholders/MediaListItemPlaceholder'
import Routes from '../../../lib/routes'
import { selectImageFromList } from '../../../lib/imageUtil'


class InvitePWF extends Component {
	constructor(props) {
		super(props)
		this.state = {
			query: null,
			showSearchResults: false,
			selectedIds: [],
		}
	}

	onUserClick = (id) => {
		const { selectedIds } = this.state
		const isAlreadySelected = selectedIds.includes(id)
		if (isAlreadySelected) {
			this.unselectFriend(id)
		} else {
			this.selectFriend(id)
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

	selectFriend = (id) => {
		const { selectedIds } = this.state
		this.setState({
			selectedIds: selectedIds.concat([id])
		})
	}
	unselectFriend = (id) => {
		const { selectedIds } = this.state
		const toDeleteIndex = selectedIds.indexOf(id)
		if (toDeleteIndex !== -1) {
			this.setState({
				selectedIds: selectedIds.splice(toDeleteIndex, 1)
			})
		}
	}

	handleInvite = () => {
		const { dispatch, auth, handleInvite } = this.props
		const { selectedIds } = this.state
		if (selectedIds.length > 0 && typeof handleInvite === 'function') {
			handleInvite(selectedIds)
		} else {
			dispatch(push(Routes.subscriptions({ username: auth.userData.username })))
		}
	}

	renderUser = (friend) => {
		const { selectedIds } = this.state
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
					onClick={this.onUserClick.bind(this, friend.id)}
				/>
				{
					selectedIds.includes(friend.id)
						&& <CheckMark />
				}
			</div>
		)
	}

	render() {
		const { search, friends, getFriends, backLink, together_id } = this.props
		const { showSearchResults, selectedIds } = this.state

		let searchResults = null
		if (showSearchResults && search) {
			searchResults = (
				<ClickTarget handleOutsideClick={this.hideSearchResults}>
					<div className='search-results'>
						<div
							className='friend-list'
							style={{
								minHeight: '350px',
								maxHeight: '350px',
								overflowY: 'auto'
							}}
						>
							{
								search.map((user) => {
									return this.renderUser(user)
								})
							}
						</div>
					</div>
				</ClickTarget>
			)
		}

		const friendsList = friends && friends.users
		const friendIds = friendsList && friendsList.map((f) => {
			return f.id
		})
		// show the friends list along with anyone selected from search results
		const selectedFromSearch = search
			&& search.reduce((result, s) => {
				if (
					selectedIds
					&& selectedIds.includes(s.id)
					&& !(friendIds && friendIds.includes(s.id))
				) {
					result.push(s)
				}
				return result
			}, [])
		const mergedUsers = (selectedFromSearch || []).concat(friendsList || [])

		return (
			<div className='pwf-flow pwf-invite'>
				<SectionedLayout>
					<h4><FormattedMessage id='invite friends' /></h4>
				</SectionedLayout>
				<div className='gray-background content' style={{ minHeight: '450px' }}>
					<div className='columns medium-5 small-12 small-centered '>
						<div className='horizontal-center vertical-center'>
							<div
								className={[
									'selected-number',
									`${
										selectedIds
										&& selectedIds.length > 150
										? 'red'
										: ''
									}`,
								].join(' ')}
							>
								{ selectedIds.length }
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
								/>
								<div style={{ position: 'relative' }}>
									{ showSearchResults && searchResults }
								</div>
								<List
									customClass='friend-list'
									loadMore={getFriends.bind(this, friends && friends.next_page)}
									style={{
										minHeight: '350px',
										maxHeight: '350px',
										overflowY: 'auto'
									}}
								>
									{
										!friendsList
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
