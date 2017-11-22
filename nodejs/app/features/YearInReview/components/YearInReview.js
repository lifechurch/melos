import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { getUserById } from '@youversion/api-redux/lib/endpoints/users/reducer'


class YearInReview extends Component {

	constructor(props) {
		super(props)
	}

	render() {
		const { user, nodeHost } = this.props
		let imgSrc;
		let introCopy;

		if (user && ('response' in user)) {
			imgSrc = `${nodeHost}/year-in-review/${user.response.id}/500`
			introCopy = (
				<div>
					<h1>Hi, {user.response.name}</h1>
					<h2>Here's a snapshot of your year in the Bible App</h2>
					<div style={{width:"500px", height:"500px",background:"#eee",margin:"0 auto"}}>
						<img src={imgSrc} />
					</div>
					<a href="#">Share Your Snapshot</a>
				</div>
			)
		}

		return (
			<div style={{"textAlign":"center"}} className="medium-10 large-7 columns small-centered">
				{introCopy}
			</div>
		)
	}
}

YearInReview.propTypes = {
	user: PropTypes.object.isRequired,
	nodeHost: PropTypes.string.isRequired
}

YearInReview.defaultProps = {

}

function mapStateToProps(state) {
	return {
		user: getUserById(state, state.userId),
		nodeHost: state.hosts.nodeHost
	}
}

export default connect(mapStateToProps, null)(YearInReview)