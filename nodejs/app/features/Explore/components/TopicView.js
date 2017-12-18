import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage, injectIntl } from 'react-intl'
import withTopicData from '@youversion/api-redux/lib/endpoints/explore/hocs/withTopic'
import Card from '@youversion/melos/dist/components/containers/Card'
import Heading1 from '@youversion/melos/dist/components/typography/Heading1'
import Heading2 from '@youversion/melos/dist/components/typography/Heading2'
import wrapWordsInTag from '@youversion/utils/lib/text/wrapWordsInTag'
import VerticalSpace from '@youversion/melos/dist/components/layouts/VerticalSpace'
import getBibleVersionFromStorage from '@youversion/utils/lib/bible/getBibleVersionFromStorage'
import TopicList from './TopicList'
import EmotionPicker from './EmotionPicker'
import ShareSheet from '../../../widgets/ShareSheet/ShareSheet'
import VerseImagesSlider from '../../../widgets/VerseImagesSlider'
import PlansRelatedToTopic from '../../../widgets/PlansRelatedToTopic'
import ReferenceContent from '../../Bible/components/content/ReferenceContent'
import List from '../../../components/List'
import { getCategoryFromEmotion } from '../assets/emotions'


export const PAGE_NUM = 3

class TopicView extends Component {
	constructor(props) {
		super(props)
		this.state = {
			page: 1,
		}
	}

	hasNextPage = () => {
		const { usfmsForTopic } = this.props
		const { page } = this.state

		return (usfmsForTopic && ((PAGE_NUM * page) < usfmsForTopic.length))
			|| false
	}

	page = () => {
		const { page } = this.state
		if (this.hasNextPage()) {
			this.setState({ page: page + 1 })
		}
	}

	render() {
		const { usfmsForTopic, topic, serverLanguageTag, hosts } = this.props
		const { nextPage, page } = this.state

		const list = (usfmsForTopic || []).slice(0, page * PAGE_NUM)
		return (
			<div>
				<div style={{ width: '100%', marginBottom: '25px' }}>
					<Heading1>
						<FormattedMessage id={topic} />
					</Heading1>
				</div>
				<div className='gray-background horizontal-center flex-wrap' style={{ padding: '50px 0 100px 0' }}>
					{/* <Helmet
							title={title}
							meta={[
							{ name: 'description', content: verse },
							{ property: 'og:title', content: title },
							{ property: 'og:url', content: url },
							{ property: 'og:description', content: verse },
							{ name: 'twitter:card', content: 'summary' },
							{ name: 'twitter:url', content: url },
							{ name: 'twitter:title', content: title },
							{ name: 'twitter:description', content: verse },
							{ name: 'twitter:site', content: '@YouVersion' },
						]}
					/> */}
					<div className='yv-large-5 yv-medium-7 yv-small-11 votd-view' style={{ width: '100%' }}>
						<VerticalSpace space={40}>
							{
								list
									&& list.length > 0
									&& (
										<Card padding='none'>
											<List
												loadMore={this.hasNextPage() && this.page}
												pageOnScroll={false}
												loadButton={<div className='card-button'><FormattedMessage id='more' /></div>}
											>
												{
													list.map((usfm) => {
														return (
															<div key={usfm} style={{ borderBottom: '2px solid #F4F4F4', padding: '35px 25px' }}>
																<VerticalSpace>
																	<ReferenceContent
																		usfm={usfm}
																		processContent={(content) => {
																			return wrapWordsInTag({ text: content, tag: 'strong', words: [topic] })
																		}}
																		version_id={getBibleVersionFromStorage(serverLanguageTag)}
																	/>
																	<VerseImagesSlider
																		usfm={usfm}
																		category='prerendered'
																		imgWidth={160}
																		imgHeight={160}
																	/>
																</VerticalSpace>
															</div>
														)
													})
												}
											</List>
										</Card>
									)
							}
							<PlansRelatedToTopic query={topic} />
							<Card>
								<div style={{ marginBottom: '25px' }}>
									<Heading2>What does the Bible say about...</Heading2>
								</div>
								<TopicList />
							</Card>
							<Card>
								<EmotionPicker
									nodeHost={hosts && hosts.nodeHost}
									category={getCategoryFromEmotion(topic)}
								/>
							</Card>
						</VerticalSpace>
					</div>
					<ShareSheet />
				</div>
			</div>
		)
	}
}

TopicView.propTypes = {
	moments: PropTypes.object,
	routeParams: PropTypes.object.isRequired,
	serverLanguageTag: PropTypes.string,
	bible: PropTypes.object,
	intl: PropTypes.object.isRequired,
	hosts: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
}

TopicView.defaultProps = {
	moments: null,
	bible: null,
	serverLanguageTag: 'en',
}

function mapStateToProps(state) {
	return {
		serverLanguageTag: state.serverLanguageTag,
		hosts: state.hosts,
	}
}

export default connect(mapStateToProps, null)(injectIntl(withTopicData(TopicView)))
