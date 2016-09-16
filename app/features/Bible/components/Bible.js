import React, { Component, PropTypes } from 'react'
import Audio from './audio/Audio'
import Header from './header/Header'
import Settings from './settings/Settings'
import VerseAction from './verseAction/VerseAction'


class Bible extends Component {
	render() {
		const { audio, settings, verseAction } = this.props
		return (
			<div>
				<Header {...this.props} />
				<Audio audio={audio} />
				<Settings settings={settings} />
				<VerseAction verseAction={verseAction} />
			</div>
		)
	}
}

Bible.propTypes = {
	bible: PropTypes.object.isRequired
}

export default Bible