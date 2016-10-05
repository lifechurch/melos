import React, { Component } from 'react'
import { connect } from 'react-redux'
import ActionCreators from '../features/Bible/actions/creators'
import Bible from '../features/Bible/components/Bible'
// import Filter from '../lib/filter'
// import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
// import Books from '../features/Bible/components/chapterPicker/Books'
// import Chapters from '../features/Bible/components/chapterPicker/Chapters'
// import Languages from '../features/Bible/components/versionPicker/Languages'
// import Versions from '../features/Bible/components/versionPicker/Versions'
// import cookie from 'react-cookie';
// import moment from 'moment'
// import ChapterPicker from '../features/Bible/components/chapterPicker/ChapterPicker'
// import LabelPill from '../features/Bible/components/verseAction/bookmark/LabelPill'
// import Color from '../features/Bible/components/verseAction/Color'


class BibleView extends Component {

	render() {
		return (
			<div>
				<div className="row">
					<div className="columns medium-12">
						<Bible {...this.props} />
					</div>
				</div>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		bible: state.bibleReader
	}
}

export default connect(mapStateToProps, null)(BibleView)
