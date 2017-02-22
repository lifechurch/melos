import React, { Component } from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { Link } from 'react-router'
import Card from '../components/Card'

const PLANS_DATA = {
	2614: {
		color: '#1BBC9B',
		title: 'Here is a Bible Plan about Depression'
	},
	2217: {
		color: '#FDB53F',
		title: 'Here is a Bible Plan about How to Read the Bible'
	},
	3400: {
		color: '#FDB53F',
		title: 'Here is a Bible Plan about How to Read the Bible'
	},
}

const COPY = {
	plans_description: 'Sometimes called Reading Plans or Devotionals, we call them “Bible Plans” because they give you daily portions of Scripture paired with devotional, audio, or video selections.',
	account_blurb: 'We hope this Plan is helping you engage with the Bible. If you’d like to keep track of which days you’ve completed, you’ll need a free account — and it IS completely free, with no ads, no strings attached. Your free account simply gives you one convenient storage place for your YouVersion Bible activity. '
}

class Lookinside extends Component {

	render() {
		const { plan, params } = this.props

		if (!plan) {
			return (
				<div />
			)
		}
		const language_tag = 'en'
		// this is gonna be passed along with the text for the title
		// from rails
		const style = {
			border: `3vw solid ${PLANS_DATA[plan.id].color}`
		}
		const metaTitle = `${plan.name[language_tag] || plan.name.default} - ${plan.about.text[language_tag] || plan.about.text.default}`
		const metaDesc = `${plan.about.text[language_tag] || plan.about.text.default}`

		return (
			<div className='row lookinside'>
				<Helmet
					title={metaTitle}
					meta={[
						{ name: 'description', content: metaDesc }
					]}
				/>
				<div className='columns medium-7'>
					<div className='lookinside-title'>
						<h1>{ PLANS_DATA[plan.id].title }</h1>
						<h2>{ COPY.plans_description }</h2>
					</div>
					<div className='card-container' style={style}>
						<Card>
							<div className='reading-plan'>
								<img alt='reading plan' src={plan.images[4].url} />
								<h4 className='title'>{ plan.name.default }</h4>
								<div className='description'>{ plan.about.html.default || plan.about.text.default }</div>
							</div>
							<div className='buttons'>
								<Link to='/reading-plans'>
									<button className='plans'>
										BROWSE ALL PLANS
									</button>
								</Link>
								<Link to={`/lookinside/${plan.id}-${plan.slug}/read/day/1`}>
									<button className='read'>
										READ THIS PLAN
									</button>
								</Link>
							</div>
						</Card>
					</div>
				</div>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		plan: state.plansDiscovery && state.plansDiscovery.plans ? state.plansDiscovery.plans : null,
		bible: state.bibleReader,
		auth: state.auth,
		hosts: state.hosts,
	}
}

export default connect(mapStateToProps, null)(Lookinside)
