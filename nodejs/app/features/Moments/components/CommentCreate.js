import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl, FormattedMessage } from 'react-intl'
import Card from '../../../components/Card'
import Textarea from '../../../components/Textarea'
import Avatar from '../../../components/Avatar'

function CommentCreate(props) {
	const {
		onComment,
		onChange,
		value,
		avatarSrc,
		avatarPlaceholder,
		intl,
		charLimit,
	} = props

	let charDiv = null
	let isOverLimit = false
	if (charLimit && value) {
		const threshold = 0.9 * charLimit
		const chars = value.length
		if (chars > threshold && chars <= charLimit) {
			charDiv = (
				<div>{ charLimit - chars }</div>
			)
		} else if (chars > charLimit) {
			isOverLimit = true
			charDiv = (
				<div className='red'>{ `-${chars - charLimit}` }</div>
			)
		}
	}

	return (
		<Card
			customClass='yv-moment-card flex'
			extension={
				<div className='space-between'>
					{ charDiv }
					<a
						tabIndex={0}
						className={`margin-left-auto ${isOverLimit ? 'font-grey' : 'green'}`}
						style={{ cursor: `${isOverLimit ? 'not-allowed' : 'pointer'}` }}
						onClick={!isOverLimit && onComment}
					>
						<FormattedMessage id='post' />
					</a>
				</div>
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
	charLimit: PropTypes.number,
}

CommentCreate.defaultProps = {
	value: '',
	avatarSrc: null,
	avatarPlaceholder: null,
	charLimit: null,
}

export default injectIntl(CommentCreate)
