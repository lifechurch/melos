import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Card from '../components/Card'

class LookinsideSample extends Component {

	render() {
		const { plan } = this.props
		// console.log(plan)
		// if (!plan) {
		// 	return (
		// 		<div />
		// 	)
		// }

		// this is gonna be passed along with the text for the title
		// from rails
		const style = {
			border: '30px solid aquamarine'
		}

		return (
			<div className='row lookinside'>
				AGEHWRUGJKERMWIANGWEFAJWEFMWIRGERGNJADWJWE
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

export default connect(mapStateToProps, null)(LookinsideSample)
