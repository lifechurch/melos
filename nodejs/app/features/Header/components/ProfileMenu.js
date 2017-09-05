import React, { PropTypes } from 'react'
import Card from '../../../components/Card'
import Avatar from '../../../components/Avatar'
import { localizedLink } from '../../../lib/routeUtils'

function buildUserLink(section, username, serverLanguageTag) {
	return localizedLink(`/users/${username}${section ? `/${section}` : ''}`, serverLanguageTag)
}

function ProfileMenu({ username, firstName, lastName, avatarUrl, serverLanguageTag }) {
	return (
		<div className="yv-profile-menu">
			<Card>
				<a target="_self" href={buildUserLink(null, username, serverLanguageTag)} className="yv-profile-avatar-name">
					<Avatar height={60} width={60} src={avatarUrl} />
					<div className="yv-profile-name">{firstName} {lastName}</div>
				</a>
				<div className="yv-profile-user-links">
					<a target="_self" href={buildUserLink('bookmarks', username, serverLanguageTag)}>Bookmarks</a>
					<a target="_self" href={buildUserLink('highlights', username, serverLanguageTag)}>Highlights</a>
					<a target="_self" href={buildUserLink('notes', username, serverLanguageTag)}>Notes</a>
					<a target="_self" href={buildUserLink('images', username, serverLanguageTag)}>Images</a>
					<a target="_self" href={buildUserLink('friends', username, serverLanguageTag)}>Friends</a>
					<a target="_self" href={buildUserLink('badges', username, serverLanguageTag)}>Badges</a>
				</div>
				<div className="yv-profile-footer">
					<a target="_self" href={localizedLink('/sign-out', serverLanguageTag)}>Sign Out</a>
				</div>
			</Card>
		</div>
	)
}

ProfileMenu.propTypes = {
	username: PropTypes.string,
	firstName: PropTypes.string,
	lastName: PropTypes.string,
	avatarUrl: PropTypes.string,
	serverLanguageTag: PropTypes.string
}

ProfileMenu.defaultProps = {
	username: null,
	firstName: null,
	lastName: null,
	avatarUrl: null,
	serverLanguageTag: null
}

export default ProfileMenu
