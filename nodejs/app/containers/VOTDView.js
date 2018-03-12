import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { FormattedMessage, injectIntl } from 'react-intl'
import moment from 'moment'
import Helmet from 'react-helmet'
import getMomentsModel from '@youversion/api-redux/lib/models/moments'
import momentsAction from '@youversion/api-redux/lib/endpoints/moments/action'
import getBibleModel from '@youversion/api-redux/lib/models/bible'
import getReferencesTitle from '@youversion/utils/lib/bible/getReferencesTitle'
import chapterifyUsfm from '@youversion/utils/lib/bible/chapterifyUsfm'
import parseVerseFromContent from '@youversion/utils/lib/bible/parseVerseContent'
import getBibleVersionFromStorage from '@youversion/utils/lib/bible/getBibleVersionFromStorage'
import localizedLink from '@youversion/utils/lib/routes/localizedLink'
import Routes from '@youversion/utils/lib/routes/routes'
import Header from '../features/Header/components/Header'
import Footer from '../features/Footer/components/Footer'
import VotdText from '../features/Moments/components/types/VotdText'
import VotdImage from '../features/Moments/components/types/VotdImage'
import ShareSheet from '../widgets/ShareSheet/ShareSheet'
import PlansRelatedToReference from '../widgets/PlansRelatedToReference'
import Card from '../components/Card'


class VOTDView extends Component {
	componentDidMount() {
		const { momentsModel, dispatch } = this.props
		if (!(momentsModel && momentsModel.configuration)) {
			dispatch(momentsAction({
				method: 'configuration',
			}))
		}
	}

	render() {
		const { location: { query }, momentsModel, bibleModel, intl, hosts, serverLanguageTag } = this.props
		const day = (query && query.day) || moment().dayOfYear()
		const votd = momentsModel
			&& momentsModel.pullVotd(day)
		const usfm = votd && votd.usfm
		const chapterUsfm = usfm && chapterifyUsfm(usfm)
		const ref = chapterUsfm && bibleModel && bibleModel.pullRef(chapterUsfm)
		let verse
		if (ref) {
			verse = parseVerseFromContent({
				usfms: usfm,
				fullContent: ref.content,
			}).text
		}
		const version_id = getBibleVersionFromStorage(serverLanguageTag)
		const versionData = bibleModel.pullVersion(version_id)
		const refStrings = versionData
			&& versionData.books
			&& getReferencesTitle({
				bookList: versionData.books,
				usfmList: usfm,
			})
		const titleString = refStrings && refStrings.title
		const version_abbr = versionData
			&& versionData.local_abbreviation && versionData.local_abbreviation.toUpperCase()
		const title = `${intl.formatMessage({ id: 'votd' })} - ${titleString} (${version_abbr}) | The Bible App | Bible.com`
		const url = `${hosts && hosts.railsHost}${Routes.votd({
			query: {
				day
			},
			serverLanguageTag
		})}`
		let imgMeta = []
		if (votd && votd.image_id) {
			const src = momentsModel
				&& momentsModel.configuration
				&& momentsModel.configuration.images.verse_images
				&& momentsModel.configuration.images.verse_images.url
					.replace('{image_id}', votd.image_id)
					.replace('{0}', 640)
					.replace('{1}', 640)
			imgMeta = [
				{ property: 'og:image', content: `https:${src}` },
				{ property: 'og:image:width', content: 640 },
				{ property: 'og:image:height', content: 640 },
				{ name: 'twitter:image', content: `https:${src}` }
			]
		}

		return (
			<div>
				<Header />
				<div className='gray-background horizontal-center' style={{ padding: '50px 0' }}>
					<Helmet
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
              ].concat(imgMeta)}
     />
					<div className='yv-large-5 yv-medium-7 yv-small-11 votd-view'>
						<VotdText dayOfYear={day} version_id={version_id} />
						<VotdImage dayOfYear={day} version_id={version_id} alt={verse} />
						<PlansRelatedToReference usfm={usfm} version_id={version_id} />
						<Card customClass='horizontal-center flex-wrap'>
							<img
								className="bible-icon"
								alt="Bible App Icon"
								src={`/assets/icons/bible/120/${serverLanguageTag}.png`}
								style={{ width: '72px', height: '72px' }}
       />

							<a
								href={localizedLink('/app', serverLanguageTag)}
								className='text-center'
								style={{
									color: 'black',
									display: 'block',
									fontSize: '26px',
									fontWeight: 600,
									width: '90%',
									margin: '25px 0'
								}}
							>
								<FormattedMessage id='get a free bible' />
							</a>
							<a href={localizedLink('/app', serverLanguageTag)} className='yv-green-link'>
								<FormattedMessage id='download the bible' />
							</a>
						</Card>
					</div>
					<ShareSheet />
				</div>
				<Footer />
			</div>
		)
	}
}

VOTDView.propTypes = {
	momentsModel: PropTypes.object,
	location: PropTypes.object.isRequired,
	serverLanguageTag: PropTypes.string,
	bibleModel: PropTypes.object,
	intl: PropTypes.object.isRequired,
	hosts: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
}

VOTDView.defaultProps = {
	momentsModel: null,
	bibleModel: null,
	serverLanguageTag: 'en',
}

function mapStateToProps(state) {
	return {
		momentsModel: getMomentsModel(state),
		bibleModel: getBibleModel(state),
		serverLanguageTag: state.serverLanguageTag,
		hosts: state.hosts,
	}
}

export default connect(mapStateToProps, null)(injectIntl(VOTDView))
