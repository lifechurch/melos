import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { push } from 'react-router-redux'
import { FormattedMessage, injectIntl } from 'react-intl'
import Heading from '@youversion/melos/dist/components/typography/Heading1'
import SectionedLayout from '@youversion/melos/dist/components/layouts/SectionedLayout'
import selectImageFromList from '@youversion/utils/lib/images/selectImageFromList'
import Routes from '@youversion/utils/lib/routes/routes'
import LazyImage from '@youversion/melos/dist/components/images/LazyImage'
import Footer from '../../../components/Footer'
import ShareLink from '../../../components/ShareLink'
import Search from '../../../components/Search'
import User from '../../../components/User'
import CheckMark from '../../../components/CheckMark'
import ClickTarget from '../../../components/ClickTarget'
import List from '../../../components/List'


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
      selectedIds.splice(toDeleteIndex, 1)
      this.setState({
        selectedIds
      })
    }
  }

  handleInvite = () => {
    const { dispatch, auth, handleInvite } = this.props
    const { selectedIds } = this.state
    if (selectedIds.length > 0 && typeof handleInvite === 'function') {
      handleInvite(selectedIds.map((id) => { return { id } }))
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
    const { search, friends, planImg, getFriends, together_id, intl } = this.props
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

    const friendsList = friends && friends.response && friends.response.users
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
        <div className='large-8 small-11 centered' style={{ marginBottom: '25px' }}>
          <SectionedLayout>
            <Heading>
              <FormattedMessage id='invite friends' />
            </Heading>
          </SectionedLayout>
        </div>
        <div
          className='gray-background content horizontal-center flex-wrap'
          style={{ minHeight: '450px', height: '100%' }}
        >
          <div style={{ width: '100%' }}>
            <div className='yv-large-4 yv-small-11 centered white'>
              {
                planImg
                  && (
                    <LazyImage
                      alt='Devotional'
                      style={{ width: '100%' }}
                      src={planImg}
                    />
                  )
              }
              {
                mergedUsers.length > 0
                && (
                  <div style={{ paddingTop: '25px' }}>
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
                          placeholder={intl.formatMessage({ id: 'header.search placeholder' })}
                        />
                        <div style={{ position: 'relative' }}>
                          { showSearchResults && searchResults }
                        </div>
                        <List
                          customClass='friend-list'
                          loadMore={getFriends.bind(this, friends && friends.response && friends.response.next_page)}
                          style={{
                            minHeight: '350px',
                            maxHeight: '350px',
                            overflowY: 'auto'
                          }}
                        >
                          {
                            friendsList
                            && mergedUsers.map((user) => {
                              return this.renderUser(user)
                            })
                          }
                        </List>
                      </div>
                    </div>
                  </div>
                  )
                }
              <ShareLink together_id={together_id} />
            </div>
          </div>
        </div>
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
  intl: PropTypes.object.isRequired
}

InvitePWF.defaultProps = {
  handleInvite: null,
  handleSearch: null,
}

export default injectIntl(InvitePWF)
