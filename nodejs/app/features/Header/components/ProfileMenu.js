import React, { PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import Card from '../../../components/Card'
import Avatar from '../../../components/Avatar'
import { localizedLink } from '../../../lib/routeUtils'

function buildUserLink(section, username, serverLanguageTag) {
	return localizedLink(`/users/${username}${section ? `/${section}` : ''}`, serverLanguageTag)
}

function ProfileMenu({ username, firstName, lastName, avatarUrl, serverLanguageTag, topContent, topAvatarContent, bottomContent }) {
	return (
		<div className={`yv-profile-menu ${!username && 'yv-profile-no-user'}`}>
			<Card>
				{topContent &&
					<div className="yv-profile-top-content">
						{topContent}
					</div>
				}

				{username &&
					<div target="_self" className="yv-profile-avatar-name">
						<Avatar height={60} width={60} src={avatarUrl} link={buildUserLink(null, username, serverLanguageTag)} />
						<div className="yv-profile-avatar-content-name">
							<div className="yv-profile-top-avatar-content">{topAvatarContent}</div>
							<a target="_self" href={buildUserLink(null, username, serverLanguageTag)} className="yv-profile-name">{firstName} {lastName}</a>
						</div>
					</div>
				}

				{username &&
					<div className="yv-profile-user-links">
						<a target="_self" href={buildUserLink('bookmarks', username, serverLanguageTag)}><FormattedMessage id="profile menu.bookmarks" /></a>
						<a target="_self" href={buildUserLink('highlights', username, serverLanguageTag)}><FormattedMessage id="profile menu.highlights" /></a>
						<a target="_self" href={buildUserLink('notes', username, serverLanguageTag)}><FormattedMessage id="profile menu.notes" /></a>
						<a target="_self" href={buildUserLink('images', username, serverLanguageTag)}><FormattedMessage id="profile menu.images" /></a>
						<a target="_self" href={buildUserLink('friends', username, serverLanguageTag)}><FormattedMessage id="profile menu.friends" /></a>
						<a target="_self" href={buildUserLink('badges', username, serverLanguageTag)}><FormattedMessage id="profile menu.badges" /></a>
					</div>
				}

				<div className="yv-profile-footer">
					{username
						? (<a target="_self" href={localizedLink('/sign-out', serverLanguageTag)}><FormattedMessage id="profile menu.sign out" /></a>)
						: bottomContent
					}
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
	serverLanguageTag: PropTypes.string,
	topContent: PropTypes.node,
	bottomContent: PropTypes.node,
	topAvatarContent: PropTypes.node
}

ProfileMenu.defaultProps = {
	username: null,
	firstName: null,
	lastName: null,
	avatarUrl: null,
	serverLanguageTag: null,
	topContent: null,
	bottomContent: null,
	topAvatarContent: null
}

export default ProfileMenu
