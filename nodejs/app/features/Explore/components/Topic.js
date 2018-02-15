import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { FormattedMessage, injectIntl } from 'react-intl'
import getBibleModel from '@youversion/api-redux/lib/models/bible'
import withTopicData from '@youversion/api-redux/lib/endpoints/explore/hocs/withTopic'
import Card from '@youversion/melos/dist/components/containers/Card'
import Heading1 from '@youversion/melos/dist/components/typography/Heading1'
import Heading2 from '@youversion/melos/dist/components/typography/Heading2'
import Body from '@youversion/melos/dist/components/typography/Body'
import Link from '@youversion/melos/dist/components/links/Link'
import SectionedLayout from '@youversion/melos/dist/components/layouts/SectionedLayout'
import wrapWordsInTag from '@youversion/utils/lib/text/wrapWordsInTag'
import chapterifyUsfm from '@youversion/utils/lib/bible/chapterifyUsfm'
import parseVerseContent from '@youversion/utils/lib/bible/parseVerseContent'
import getBibleVersionFromStorage from '@youversion/utils/lib/bible/getBibleVersionFromStorage'
import Routes from '@youversion/utils/lib/routes/routes'
import VerticalSpace from '@youversion/melos/dist/components/layouts/VerticalSpace'
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
		const { usfmsForTopic, topic, hosts, intl, version_id, bibleModel, serverLanguageTag } = this.props
		const { page } = this.state

		const list = (usfmsForTopic || []).slice(0, page * PAGE_NUM)
		const title = intl.formatMessage({ id: 'what the bible says about' }, { topic })
		const firstChapter = list
			&& list.length > 0
			&& bibleModel
			&& bibleModel.pullRef(chapterifyUsfm(list[0]))
			&& bibleModel.pullRef(chapterifyUsfm(list[0])).content
		const description = firstChapter
			&& parseVerseContent({
				usfms: list[0],
				fullContent: firstChapter,
			}).text
		const url = `${hosts && hosts.railsHost}${Routes.exploreTopic({
			topic,
			query: {
				version: version_id
			},
			serverLanguageTag
		})}`

		return (
			<div>
				<Helmet
					title={title}
					meta={[
						{ name: 'description', content: description },
						{ property: 'og:title', content: title },
						{ property: 'og:url', content: url },
						{ property: 'og:description', content: description },
						{ name: 'twitter:card', content: 'summary' },
						{ name: 'twitter:url', content: url },
						{ name: 'twitter:title', content: title },
						{ name: 'twitter:description', content: description },
						{ name: 'twitter:site', content: '@YouVersion' },
					]}
				/>
				<div
					className='yv-large-6 yv-medium-9 yv-small-11 centered'
					style={{ marginBottom: '25px' }}
				>
					<SectionedLayout
						left={(
							<Link
								to={Routes.explore({
									serverLanguageTag,
									query: { version: version_id }
								})}
							>
								<Body muted>
									<FormattedMessage id='explore' />
								</Body>
							</Link>
						)}
					>
						<Heading1>
							<FormattedMessage id='what the bible says about' values={{ topic }} />
						</Heading1>
					</SectionedLayout>
				</div>
				<div
					className='gray-background horizontal-center flex-wrap'
					style={{ padding: '50px 0 100px 0' }}
				>
					<div
						className='yv-large-5 yv-medium-7 yv-small-11 votd-view'
						style={{ width: '100%' }}
					>
						<VerticalSpace space={40}>
							{
								list
									&& list.length > 0
									&& (
										<Card padding='none'>
											<List
												loadMore={this.hasNextPage() && this.page}
												pageOnScroll={false}
												loadButton={(
													<div className='card-button'>
														<FormattedMessage id='Reader.header.more label' />
													</div>
												)}
											>
												{
													list.map((usfm) => {
														return (
															<div
																key={usfm}
																style={{
																	borderBottom: '2px solid #F4F4F4',
																	padding: '35px 25px'
																}}
															>
																<VerticalSpace>
																	<ReferenceContent
																		usfm={usfm}
																		processContent={(content) => {
																			return wrapWordsInTag({
																				text: content,
																				tag: 'strong',
																				words: [topic]
																			})
																		}}
																		version_id={version_id}
																	/>
																	<VerseImagesSlider
																		usfm={usfm}
																		category='prerendered'
																		imgWidth={160}
																		imgHeight={160}
																		version_id={version_id}
																		linkBuilder={({ id }) => {
																			return Routes.votdImage({
																				usfm,
																				id,
																				serverLanguageTag,
																				query: {
																					version: version_id
																				}
																			})
																		}}
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
							<PlansRelatedToTopic query={topic} version_id={version_id} />
							<Card>
								<div style={{ marginBottom: '25px' }}>
									<Heading2>
										<FormattedMessage id='what does the bible say' />
									</Heading2>
								</div>
								<TopicList version_id={version_id} />
							</Card>
							<Card>
								<EmotionPicker
									category={getCategoryFromEmotion(topic)}
									version_id={version_id}
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
	topic: PropTypes.string.isRequired,
	usfmsForTopic: PropTypes.array,
	version_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	bibleModel: PropTypes.object,
	serverLanguageTag: PropTypes.string,
	intl: PropTypes.object.isRequired,
	hosts: PropTypes.object.isRequired,
}

TopicView.defaultProps = {
	usfmsForTopic: null,
	bibleModel: null,
	bible: null,
	serverLanguageTag: 'en',
	version_id: getBibleVersionFromStorage('en'),
}

function mapStateToProps(state) {
	return {
		serverLanguageTag: state.serverLanguageTag,
		hosts: state.hosts,
		bibleModel: getBibleModel(state),
	}
}

export default connect(mapStateToProps, null)(withTopicData(injectIntl(TopicView)))
