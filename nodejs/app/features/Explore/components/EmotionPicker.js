import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import Heading2 from '@youversion/melos/dist/components/typography/Heading2'
import getBibleVersionFromStorage from '@youversion/utils/lib/bible/getBibleVersionFromStorage'
import TopicList from './TopicList'
import EMOTIONS from '../assets/emotions'

const emojis = {
	happy: '/assets/happy.png',
	sad: '/assets/sad.png',
	angry: '/assets/angry.png',
	afraid: '/assets/afraid.png'
}

class EmotionPicker extends Component {
	constructor(props) {
		super(props)
		const { category } = props
		this.state = {
			category
		}
	}

	changeCategory = (category) => {
		if (category) {
			this.setState({ category })
		}
	}

	render() {
		const { version_id } = this.props
		const { category } = this.state

		return (
			<div>
				<div style={{ marginBottom: '10px' }}>
					<Heading2>
						<FormattedMessage id='how are you feeling' />
					</Heading2>
				</div>
				<div
					className='vertical-center flex-wrap'
					style={{
						justifyContent: 'space-around',
						marginBottom: '-1px'
					}}
				>
					{
						EMOTIONS.allCategories.map((cat) => {
							return (
								<a
									key={cat}
									tabIndex={0}
									title={cat}
									onClick={this.changeCategory.bind(this, cat)}
									className={(cat === category) ? 'gray-background' : ''}
									style={{ padding: '7px', borderRadius: '8px 8px 0 0' }}
								>
									<img
										alt={cat}
										src={emojis[cat]}
										height='32px'
										width='32px'
									/>
								</a>
							)
						})
					}
				</div>
				<div
					className='gray-background'
					style={{
						borderRadius: '10px',
						padding: '10px 5px'
					}}
				>
					<TopicList
						topics={EMOTIONS.byCategory[category.toLowerCase()]}
						version_id={version_id}
					/>
				</div>
			</div>
		)
	}
}

EmotionPicker.propTypes = {
	category: PropTypes.string,
	version_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

EmotionPicker.defaultProps = {
	category: 'happy',
	version_id: getBibleVersionFromStorage('en'),
}

export default EmotionPicker
