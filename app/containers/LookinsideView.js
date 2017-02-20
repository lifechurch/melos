import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Card from '../components/Card'

class Lookinside extends Component {

	render() {
		const { plan } = this.props

		if (!plan) {
			return (
				<div />
			)
		}

		// this is gonna be passed along with the text for the title
		// from rails
		const style = {
			border: '30px solid aquamarine'
		}

		return (
			<div className='row lookinside'>
				<div className='columns large-7'>
					<div className='lookinside-title'>
						<h1>This is a title dude!</h1>
						<div>this is a description</div>
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
								<Link to={`/lookinside/${plan.id}-${plan.slug}/read?day=1`}>
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
