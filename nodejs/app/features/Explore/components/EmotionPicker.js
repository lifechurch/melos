import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import Heading2 from '@youversion/melos/dist/components/typography/Heading2'
import TopicList from './TopicList'
import EMOTIONS from '../assets/emotions'
import happy from '../assets/happy.png'
import sad from '../assets/sad.png'
import angry from '../assets/angry.png'
import afraid from '../assets/afraid.png'

const emojis = {
	happy,
	sad,
	angry,
	afraid
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
		const { nodeHost } = this.props
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
										src={`${nodeHost}${emojis[cat]}`}
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
					<TopicList topics={EMOTIONS.byCategory[category.toLowerCase()]} />
				</div>
			</div>
		)
	}
}

EmotionPicker.propTypes = {
	category: PropTypes.string,
	nodeHost: PropTypes.string.isRequired,
}

EmotionPicker.defaultProps = {
	category: 'happy',
}

export default EmotionPicker
