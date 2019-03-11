import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { FormattedMessage, injectIntl } from 'react-intl'
import rtlDetect from 'rtl-detect'
import localOnceDaily from '@youversion/utils/lib/localOnceDaily'
import StackedContainer from '../components/StackedContainer'
import CheckMark from '../components/CheckMark'
import ProgressBar from '../components/ProgressBar'
import CarouselStandard from '../components/Carousel/CarouselStandard'
import Share from '../features/Bible/components/verseAction/share/Share'

class PlanCompleteView extends Component {
  componentDidMount() {
    const { params: { id, day }, auth } = this.props
    const userId = auth && auth.userData ? auth.userData.userid : null
    const planId = id.split('-')[0]

    localOnceDaily(`PlanDayComplete-${userId}-${planId}-last`, (handleSuccess) => {
      try {
        // Google Tag Manager Event
        if (window && window.dataLayer && [ 'www.bible.com', 'my.bible.com', 'events.bible.com', 'nodejs.bible.com' ].indexOf(window.location.hostname) !== -1) {
          window.dataLayer.push({
            event: 'plan_day_complete'
          })
          handleSuccess()
        }
      } catch (e) {}
    })
  }


  localizedLink = (link) => {
    const { params, serverLanguageTag } = this.props
    const languageTag = serverLanguageTag || params.lang || 'en'

    if (['en', 'en-US'].indexOf(languageTag) > -1) {
      return link
    } else {
      return `/${languageTag}${link}`
    }
  }

  isRtl = () => {
    const { params, serverLanguageTag } = this.props
    const languageTag = params.lang || serverLanguageTag || 'en'
    return rtlDetect.isRtlLang(languageTag)
  }

  render() {
    const {
      params: { id, day },
      plans,
      recommendedPlans,
      savedPlans,
      auth,
      imageConfig,
      intl
    } = this.props

    const plan = plans[id.split('-')[0]]
    const recommended = recommendedPlans[id.split('-')[0]]
    if (!plan) return <div />

    let savedDiv = null
    let recommendedDiv = null
    if (savedPlans && savedPlans.items && savedPlans.items.length > 0) {
      savedPlans.title = intl.formatMessage({ id: 'plans.saved plans' })
      savedDiv = (
        <CarouselStandard carouselContent={savedPlans} context='saved' imageConfig={imageConfig} localizedLink={this.localizedLink} isRtl={this.isRtl} />
      )
    }
    if (recommended && recommended.items && recommended.items.length > 0) {
      recommended.id = plan.id
      recommendedDiv = (
        <CarouselStandard carouselContent={recommended} context='recommended' imageConfig={imageConfig} localizedLink={this.localizedLink} isRtl={this.isRtl} />
      )
    }
    const backImgStyle = {
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${plan.images ? plan.images[4].url : 'https://s3.amazonaws.com/yvplans-staging/default/720x405.jpg'})`
    }

    return (
      <div className='rp-completed-view'>
        <div className='completed-header'>
          <h6 className='horizontal-center'>
            <FormattedMessage id="plans.complete" />
          </h6>
          <div className='plan-length-header horizontal-center'>
            <FormattedMessage id="plans.congratulations" />
          </div>
        </div>
        <StackedContainer width={'100%'} height={'380px'}>
          <div className='parallax-back-img' style={backImgStyle} />
          <div className='content columns large-8 medium-8 horizontal-center'>
            <div className='row horizontal-center vertical-center'>
              <Link to={this.localizedLink(`/users/${auth.userData.username}/reading-plans`)} className='circle-buttons vertical-center horizontal-center'>
                <CheckMark fill='#6ab750' width={27} height={26} />
              </Link>
            </div>
            <div className='row horizontal-center vertical-center'>
              <img alt='reading plan' src={plan.images ? plan.images[7].url : 'https://s3.amazonaws.com/yvplans-staging/default/720x405.jpg'} height={160} width={310} />
            </div>
            <div className='row horizontal-center vertical-center'>
              <ProgressBar
                percentComplete={100}
                width={'250px'}
                height={'10px'}
                isRtl={this.isRtl()}
              />
            </div>
          </div>
        </StackedContainer>
        <div className='row horizontal-center vertical-center'>
          {
            typeof window !== 'undefined' ?
              <Share
                text={plan.name.default}
                url={this.localizedLink(`${window.location.origin}/reading-plans/${plan.id}-${plan.slug}`)}
                button={
                  <button className='solid-button share-button'>
                    <FormattedMessage id='features.EventEdit.components.EventEditNav.share' />
                  </button>
              }
              /> :
            null
          }
        </div>
        <div className='row horizontal-center vertical-center'>
          <Link to={this.localizedLink(`/users/${auth.userData.username}/reading-plans`)} className='small-font'>
            <FormattedMessage id="plans.widget.view my plans" />
          </Link>
        </div>
        <div className='row carousels horizontal-center'>
          { savedDiv }
          { recommendedDiv }
        </div>

      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    plans: state.readingPlans && state.readingPlans.fullPlans && state.readingPlans.fullPlans ? state.readingPlans.fullPlans : null,
    recommendedPlans: state.readingPlans && state.readingPlans.recommendedPlans && state.readingPlans.recommendedPlans ? state.readingPlans.recommendedPlans : null,
    savedPlans: state.readingPlans && state.readingPlans.savedPlans && state.readingPlans.savedPlans ? state.readingPlans.savedPlans : null,
    imageConfig: (state.plansDiscovery && state.plansDiscovery.configuration && state.plansDiscovery.configuration.images) ? state.plansDiscovery.configuration.images : {},
    auth: state.auth,
    hosts: state.hosts,
    serverLanguageTag: state.serverLanguageTag
  }
}

export default connect(mapStateToProps, null)(injectIntl(PlanCompleteView))
