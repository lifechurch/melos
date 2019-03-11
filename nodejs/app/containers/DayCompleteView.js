import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { FormattedMessage } from 'react-intl'
import rtlDetect from 'rtl-detect'
import readingPlansAction from '@youversion/api-redux/lib/endpoints/readingPlans/action'
import { getProgressById } from '@youversion/api-redux/lib/endpoints/plans'
import { getPlanById } from '@youversion/api-redux/lib/endpoints/readingPlans/reducer'
import calcProgress from '@youversion/utils/lib/readingPlans/calcProgress'
import PLAN_DEFAULT from '@youversion/utils/lib/images/readingPlanDefault'
import localOnceDaily from '@youversion/utils/lib/localOnceDaily'
import selectImageFromList from '@youversion/utils/lib/images/selectImageFromList'
import Routes from '@youversion/utils/lib/routes/routes'
import LazyImage from '@youversion/melos/dist/components/images/LazyImage'
import StackedContainer from '../components/StackedContainer'
import CheckMark from '../components/CheckMark'
import ProgressBar from '../components/ProgressBar'
import Share from '../features/Bible/components/verseAction/share/Share'


class DayCompleteView extends Component {
  componentDidMount() {
    const { dispatch, params: { id, day }, plan, auth } = this.props
    const userId = auth && auth.userData ? auth.userData.userid : null
    const planId = id.split('-')[0]
    if (!plan) {
      dispatch(readingPlansAction({
        method: 'view',
        params: {
          id: planId,
        },
      }))
    }

    localOnceDaily(`PlanDayComplete-${userId}-${planId}-${day}`, (handleSuccess) => {
      try {
        // Google Tag Manager Event
        if (window && window.dataLayer && [ 'www.bible.com', 'my.bible.com', 'events.bible.com', 'nodejs.bible.com', 'localhost' ].indexOf(window.location.hostname) !== -1) {
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
    const { params: { id, day, subscription_id }, plan, progress, auth } = this.props

    const imgSrc = plan
      && plan.images
      ? selectImageFromList({
        images: plan.images,
        width: 720,
        height: 405
      }).url
      : null
    const backImgStyle = {
      backgroundImage: `
        linear-gradient(
          rgba(0, 0, 0, 0.5),
          rgba(0, 0, 0, 0.5)),
          url(${imgSrc})`
    }

    const username = auth && auth.userData ? auth.userData.username : null
    const userid = auth && auth.userData ? auth.userData.userid : null
    const plan_id = id.split('-')[0]
    const slug = id.split('-')[1]
    const dayNum = parseInt(day, 10)
    const totalDays = plan ? plan.total_days : null
    const nextLink = (dayNum + 1) <= totalDays
      ? Routes.subscriptionDay({
        username,
        plan_id,
        slug,
        subscription_id,
        day: dayNum + 1
      })
      : Routes.subscriptionDay({
        username,
        plan_id,
        slug,
        subscription_id,
        day: 1
      })


    return (
      <div className='rp-completed-view'>
        <div className='completed-header'>
          <h6 className='horizontal-center'>
            <FormattedMessage id="plans.day complete" />
          </h6>
          <div className='plan-length-header horizontal-center'>
            <FormattedMessage id="plans.which day in plan" values={{ day, total: totalDays }} />
          </div>
        </div>
        <StackedContainer width={'100%'} height={'380px'}>
          <div className='parallax-back-img' style={backImgStyle} />
          <div className='content columns large-8 medium-8 horizontal-center'>
            <div className='row horizontal-center vertical-center'>
              <Link to={this.localizedLink(nextLink)} className='circle-buttons vertical-center horizontal-center'>
                <CheckMark fill='#6ab750' width={27} height={26} />
              </Link>
            </div>
            <div className='row horizontal-center vertical-center'>
              <LazyImage
                alt='plan-image'
                src={imgSrc}
                width={310}
                height={160}
                placeholder={<img alt='plan' src={PLAN_DEFAULT} />}
              />
            </div>
            <div className='row horizontal-center vertical-center'>
              <ProgressBar
                percentComplete={progress}
                width={'250px'}
                height={'9px'}
                isRtl={this.isRtl()}
              />
            </div>
          </div>
        </StackedContainer>
        <div className='row horizontal-center vertical-center'>
          {
            typeof window !== 'undefined' ?
              <Share
                text={plan && plan.name ? plan.name.default : null}
                url={this.localizedLink(
                  Routes.sharedDayComplete({
                    username,
                    plan_id,
                    slug,
                    query: {
                      userid
                    }
                  })
                )}
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
          <Link to={this.localizedLink(Routes.subscriptions({ username }))} className='small-font'>
            <FormattedMessage id="plans.widget.view my plans" />
          </Link>
          &nbsp;
          &bull;
          &nbsp;
          <Link to={this.localizedLink(nextLink)} className='small-font'>
            <FormattedMessage id="plans.next" />
            &rarr;
          </Link>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state, props) {
  const { params: { id, subscription_id } } = props
  const plan_id = id.split('-')[0]

  return {
    plan: getPlanById(state, plan_id),
    progress: getProgressById(state, subscription_id)
      && getProgressById(state, subscription_id).data.days
      ? calcProgress({
        progressDays: getProgressById(state, subscription_id).data.days
      }).completion_percentage
      : null,
    auth: state.auth,
    hosts: state.hosts,
    serverLanguageTag: state.serverLanguageTag
  }
}

DayCompleteView.propTypes = {
  plan: PropTypes.object.isRequired,
  progress: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  serverLanguageTag: PropTypes.string.isRequired,
}


export default connect(mapStateToProps, null)(DayCompleteView)
