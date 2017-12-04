import React, { PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import withTopicsData from '@youversion/api-redux/lib/endpoints/explore/hocs/withTopics'
import ButtonStroke from '@youversion/melos/dist/components/links/ButtonStroke'
import Routes from '../../lib/routes'

function TopicList(props) {
	const { topics, serverLanguageTag } = props
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
								})}
							>
								{
									topic && <FormattedMessage id={topic} />
								}
							</ButtonStroke>
						</div>
					)
				})
			}
		</div>
	)
}

TopicList.propTypes = {

}

TopicList.defaultProps = {

}

export default withTopicsData(TopicList)
