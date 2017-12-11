import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage, injectIntl } from 'react-intl'
import getPlansModel from '@youversion/api-redux/lib/models/readingPlans'
import getBibleModel from '@youversion/api-redux/lib/models/bible'
import withPlanSearch from '@youversion/api-redux/lib/endpoints/search/hocs/withPlanSearch'
import PLAN_DEFAULT from '@youversion/utils/lib/images/readingPlanDefault'
import Routes from '@youversion/utils/lib/routes/routes'
import selectImageFromList from '@youversion/utils/lib/images/selectImageFromList'
import LazyImage from '../components/LazyImage'
import Grid from '../components/Grid'
import Card from '../components/Card'


class PlansRelatedToTopic extends Component {

	render() {
		const { plansSearchResults, subTitle, serverLanguageTag, query, intl } = this.props

		if (!(plansSearchResults && plansSearchResults.length > 0)) return null
		return (
			<Card className='plans-related-to-reference'>
				<h2 style={{ padding: '0 10px' }}>
					<div style={{ fontSize: '18px', marginBottom: '20px' }}>
						<FormattedMessage
							id='Reader.plan title ref'
							values={{ reference: query }}
						/>
					</div>
					{ subTitle }
				</h2>
				<Grid lgCols={3} medCols={3} smCols={2}>
					{
						plansSearchResults.map((plan) => {
							const src = plan.images
								? selectImageFromList({
									images: plan.images,
									width: 620,
									height: 310,
								}).url
								: PLAN_DEFAULT
							const name = plan.name && (plan.name[serverLanguageTag] || plan.name.default)

							return (
								<a
									key={plan.id}
									style={{ marginBottom: '20px', padding: '0 5px' }}
									href={Routes.plan({
										plan_id: plan.id,
										slug: plan.slug,
										serverLanguageTag
									})}
									title={`${intl.formatMessage({ id: 'plans.about this plan' })}: ${name}`}
									className='horizontal-center vertical-center flex-wrap'
								>
									<LazyImage
										src={src}
										width={165}
										height={100}
										imgClass='radius-5'
									/>
									<div
										className='yv-text-ellipsis'
										style={{ fontSize: '12px', color: 'black', width: '90%' }}
									>
										{ name }
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

PlansRelatedToTopic.propTypes = {
	usfm: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
	plans: PropTypes.object,
	bible: PropTypes.object,
	subTitle: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
	serverLanguageTag: PropTypes.string,
	intl:	PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
}

PlansRelatedToTopic.defaultProps = {
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

export default connect(mapStateToProps, null)(injectIntl(withPlanSearch(PlansRelatedToTopic)))
