import React, { PropTypes } from 'react'
import withTopicsData from '@youversion/api-redux/lib/endpoints/explore/hocs/withTopics'
import ButtonStroke from '@youversion/melos/dist/components/links/ButtonStroke'
import Routes from '@youversion/utils/lib/routes/routes'

function TopicList(props) {
	const { topics, serverLanguageTag, version_id } = props
	return (
		<div className='flex-wrap horizontal-center'>
			{
				topics && topics.map((topic) => {
					return (
						<div key={topic} style={{ margin: '4px' }}>
							<ButtonStroke
								color='#FFFFFF'
								textColor='#000000'
								to={Routes.exploreTopic({
									serverLanguageTag,
									topic,
									query: { version: version_id }
								})}
							>
								{ topic }
							</ButtonStroke>
						</div>
					)
				})
			}
		</div>
	)
}

TopicList.propTypes = {
	topics: PropTypes.array,
	serverLanguageTag: PropTypes.string,
	version_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

TopicList.defaultProps = {
	topics: null,
	serverLanguageTag: 'en',
	version_id: null,
}

export default withTopicsData(TopicList)
