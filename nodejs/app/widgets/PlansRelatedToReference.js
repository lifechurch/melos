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
		const { usfm, plans, bible, serverLanguageTag, intl } = this.props

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

		return (
			<Card className='plans-related-to-reference'>
				<h2>
					<div style={{ fontSize: '18px' }}>
						<FormattedMessage
							id='Reader.plan title ref'
							values={{ reference: refStrings && refStrings.title }}
						/>
					</div>
					<br />
					<div style={{ fontSize: '15px' }}>
						<FormattedMessage id='Reader.plan subtitle' />
					</div>
				</h2>
				<Grid>
					{
						plansList
							&& plansList.length > 0
							&& plansList.map((plan) => {
								const src = planSrcTemplate
									.replace('{0}', '320')
									.replace('{1}', '180')
									.replace('{image_id}', plan.id)

								return (
									<div key={plan.id}>
										<a
											href={Routes.plan({
												plan_id: plan.id,
												slug: plan.slug,
												serverLanguageTag
											})}
											title={`${intl.formatMessage({ id: 'plans.about this plan' })}: ${plan.name}`}
											className='vertical-center flex-wrap'
										>
											<LazyImage
												src={src}
												width={150}
												height={75}
												customClass='radius-5'
											/>
										</a>
									</div>
								)
							})
					}
				</Grid>
			</Card>
		)
	}
}

PlansRelatedToReference.propTypes = {

}

PlansRelatedToReference.defaultProps = {

}

function mapStateToProps(state) {
	return {
		plans: getPlansModel(state),
		bible: getBibleModel(state),
		serverLanguageTag: state.serverLanguageTag,
	}
}

export default connect(mapStateToProps, null)(injectIntl(PlansRelatedToReference))
