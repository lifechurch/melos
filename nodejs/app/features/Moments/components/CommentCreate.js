import React, { PropTypes } from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import Card from '../../../components/Card'
import Textarea from '../../../components/Textarea'
import Avatar from '../../../components/Avatar'

function CommentCreate(props) {
	const { onComment, onChange, value, avatarSrc, avatarPlaceholder, intl } = props

	return (
		<Card
			customClass='yv-moment-card flex'
			extension={
				<a
					tabIndex={0}
					className='green flex-end'
					onClick={onComment}
				>
					<FormattedMessage id='post' />
				</a>
			}
		>
			<div style={{ display: 'inline-flex', alignItems: 'flex-start', marginRight: '15px' }}>
				<Avatar
					src={avatarSrc}
					width={38}
					placeholderText={avatarPlaceholder}
				/>
			</div>
			<Textarea
				style={{ flex: 1, padding: '10px 0' }}
				className='yv-textarea'
				placeholder={intl.formatMessage({ id: 'features.EventEdit.features.content.components.ContentTypeAnnouncement.prompt' })}
				onChange={(val) => { onChange(val.target.value) }}
				value={value}
			/>
		</Card>
	)
}

CommentCreate.propTypes = {
	onComment: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	value: PropTypes.string,
	avatarSrc: PropTypes.string,
	avatarPlaceholder: PropTypes.string,
	intl: PropTypes.object.isRequired,
}

CommentCreate.defaultProps = {
	value: null,
	avatarSrc: null,
	avatarPlaceholder: null,
}

export default injectIntl(CommentCreate)
