import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage, injectIntl } from 'react-intl'
import withPlanSearch from '@youversion/api-redux/lib/endpoints/search/hocs/withPlanSearch'
import PLAN_DEFAULT from '@youversion/utils/lib/images/readingPlanDefault'
import Routes from '@youversion/utils/lib/routes/routes'
import selectImageFromList from '@youversion/utils/lib/images/selectImageFromList'
import LazyImage from '@youversion/melos/dist/components/images/LazyImage'
import Grid from '../components/Grid'
import Card from '../components/Card'


function PlansRelatedToTopic(props) {
	const { plansSearchResults, serverLanguageTag, query, intl } = props

	if (!(plansSearchResults && plansSearchResults.length > 0)) return null
	const plans = plansSearchResults.slice(0, 9)
	return (
		<Card className='plans-related-to-reference'>
			<h2 style={{ padding: '0 10px' }}>
				<div style={{ fontSize: '18px', marginBottom: '20px' }}>
					<FormattedMessage
						id='Reader.plan title ref'
						values={{ reference: <strong>{ query }</strong> }}
					/>
				</div>
			</h2>
			<Grid lgCols={3} medCols={3} smCols={2}>
				{
					plans.map((plan) => {
						const src = plan.images
							&& selectImageFromList({
								images: plan.images,
								width: 620,
								height: 310,
							}).url
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
									placeholder={
										<img
											alt='Reading Plan Default'
											src={PLAN_DEFAULT}
											className='radius-5'
										/>
									}
									src={src}
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

PlansRelatedToTopic.propTypes = {
	/**
	 * The topic that we want plans for
	 * @type {String}
	 */
	query: PropTypes.string,
	plansSearchResults: PropTypes.array,
	serverLanguageTag: PropTypes.string,
	intl:	PropTypes.object.isRequired,
}

PlansRelatedToTopic.defaultProps = {
	query: null,
	plansSearchResults: null,
	serverLanguageTag: 'en',
}

function mapStateToProps(state) {
	return {
		serverLanguageTag: state.serverLanguageTag,
	}
}

export default connect(mapStateToProps, null)(injectIntl(withPlanSearch(PlansRelatedToTopic)))
