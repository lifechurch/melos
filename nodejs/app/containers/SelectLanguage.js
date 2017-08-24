import React from 'react'
import { connect } from 'react-redux'
import LangSelector from '../features/Footer/components/LangSelector'
import EventHeader from '../components/EventHeader'

function SelectLanguage(props) {
	return (
		<div className="yv-events-select-lang">
			<EventHeader {...props} />
			<LangSelector {...props} redirectToRoot={true} />
		</div>
	)
}

function mapStateToProps(state) {
	return {
		auth: state.auth
	}
}

export default connect(mapStateToProps, null)(SelectLanguage)
