import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage, injectIntl } from 'react-intl'
import readingPlansAction from '@youversion/api-redux/lib/endpoints/readingPlans/action'
import getPlansModel from '@youversion/api-redux/lib/models/readingPlans'
import getBibleModel from '@youversion/api-redux/lib/models/bible'
import LazyImage from '../components/LazyImage'
import Grid from '../components/Grid'
import Card from '../components/Card'
import { getBibleVersionFromStorage } from '../lib/readerUtils'
import { getReferencesTitle } from '../lib/usfmUtils'
import { PLAN_DEFAULT } from '../lib/imageUtil'
import Routes from '../lib/routes'


class PlansRelatedToReference extends Component {
	componentDidMount() {
		this.getPlans()
	}

	componentWillReceiveProps(nextProps) {
		const { usfm } = this.props
		if (nextProps.usfm && nextProps.usfm !== usfm) {
			this.getPlans()
		}
	}

	getPlans = () => {
		const { usfm, plans, dispatch, serverLanguageTag } = this.props
		if (usfm) {
			if (!(plans && plans.configuration)) {
				dispatch(readingPlansAction({
					method: 'configuration'
				}))
			}
			if (!(plans && plans.plans_by_reference && this.usfmString in plans.plans_by_reference)) {
				dispatch(readingPlansAction({
					method: 'plans_by_reference',
					params: {
						usfm: this.usfmString,
						language_tag: serverLanguageTag,
					}
				}))
			}
		}
	}

	render() {
		const { usfm, plans, subTitle, bible, serverLanguageTag, intl } = this.props

		this.usfmString = Array.isArray(usfm)
			? usfm.join('+')
			: usfm
		const plansList = plans
			&& plans.plans_by_reference
			&& plans.plans_by_reference[this.usfmString]
			&& plans.plans_by_reference[this.usfmString].reading_plans
			&& plans.plans_by_reference[this.usfmString].reading_plans.slice(0, 9)
		const planSrcTemplate = plans.configuration
			&& plans.configuration.images
			&& plans.configuration.images.reading_plans
			&& plans.configuration.images.reading_plans.url
		const version_id = getBibleVersionFromStorage()
		const versionData = bible
			&& bible.versions
			&& bible.versions.byId
			&& bible.versions.byId[version_id]
			&& bible.versions.byId[version_id].response
		const refStrings = versionData
			&& versionData.books
			&& getReferencesTitle({
				bookList: versionData.books,
				usfmList: usfm,
			})

		if (!(plansList && plansList.length > 0)) {
			return null
		}

		return (
			<Card className='plans-related-to-reference'>
				<h2 style={{ padding: '0 10px' }}>
					<div style={{ fontSize: '18px', marginBottom: '20px' }}>
						<FormattedMessage
							id='Reader.plan title ref'
							values={{ reference: refStrings && refStrings.title }}
						/>
					</div>
					{ subTitle }
				</h2>
				<Grid lgCols={3} smCols={2}>
					{
						plansList.map((plan) => {
							const src = planSrcTemplate
								.replace('{0}', '320')
								.replace('{1}', '180')
								.replace('{image_id}', plan.id)

							return (
								<a
									key={plan.id}
									style={{ marginBottom: '20px', padding: '0 5px' }}
									href={Routes.plan({
										plan_id: plan.id,
										slug: plan.slug,
										serverLanguageTag
									})}
									title={`${intl.formatMessage({ id: 'plans.about this plan' })}: ${plan.name}`}
									className='horizontal-center vertical-center flex-wrap'
								>
									<LazyImage
										placeholder={
											<img alt='Reading Plan Default' src={PLAN_DEFAULT} />
										}
										src={src}
										width={165}
										height={90}
										customClass='radius-5'
									/>
									<div
										className='yv-text-ellipsis'
										style={{ fontSize: '12px', color: 'black', width: '90%' }}
									>
										{ plan.name }
									</div>
								</a>
							)
						})
					}
				</Grid>
			</Card>
		)
	}
}

PlansRelatedToReference.propTypes = {
	usfm: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
	plans: PropTypes.object,
	bible: PropTypes.object,
	subTitle: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
	serverLanguageTag: PropTypes.string,
	intl:	PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
}

PlansRelatedToReference.defaultProps = {
	usfm: null,
	plans: null,
	subTitle: null,
	bible: null,
	serverLanguageTag: 'en',
}

function mapStateToProps(state) {
	return {
		plans: getPlansModel(state),
		bible: getBibleModel(state),
		serverLanguageTag: state.serverLanguageTag,
	}
}

export default connect(mapStateToProps, null)(injectIntl(PlansRelatedToReference))
