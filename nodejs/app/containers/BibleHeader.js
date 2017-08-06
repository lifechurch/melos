import React, { Component, PropTypes } from 'react'

class BibleHeader extends Component {
	constructor(props) {
		super(props)
		this.state = {

		}
	}

	componentDidMount() {

	}

	componentDidUpdate(prevProps, prevState) {

	}

	render() {
		const {
			showChapterPicker,
			showVersionPicker,
			showAudio,
			showSettings,
			showParallel,
			onRefSelect,
		} = this.props

		return (
			<Header sticky={true} classes={'reader-header horizontal-center'}>
				{
					showChapterPicker &&
					<ChapterPicker
						{...this.props}
						chapter={bible.chapter}
						books={bible.books.all}
						bookMap={bible.books.map}
						selectedLanguage={this.state.selectedLanguage}
						initialBook={this.state.selectedBook}
						initialChapter={this.state.selectedChapter}
						versionID={this.state.selectedVersion}
						versionAbbr={bible.version.local_abbreviation}
						initialInput={bible.chapter.reference.human}
						initialChapters={this.chapters}
						cancelDropDown={this.state.chapDropDownCancel}
						onRefSelect={onRefSelect}
						ref={(cpicker) => { this.chapterPickerInstance = cpicker }}
						linkBuilder={(version, usfm, abbr) => {
							return `${buildBibleLink(version, usfm, abbr)}${hasParallel ? `?parallel=${bible.parallelVersion.id}` : ''}`
						}}
					/>
				}
				<VersionPicker
					{...this.props}
					version={bible.version}
					languages={bible.languages.all}
					versions={bible.versions}
					recentVersions={this.state.recentVersions}
					languageMap={bible.languages.map}
					selectedChapter={this.state.selectedChapter}
					alert={this.state.chapterError}
					getVersions={this.getVersions}
					cancelDropDown={this.state.versionDropDownCancel}
					extraClassNames="main-version-picker-container"
					ref={(vpicker) => { this.versionPickerInstance = vpicker }}
					linkBuilder={(version, usfm, abbr) => {
						return `${buildBibleLink(version, usfm, abbr)}${hasParallel ? `?parallel=${bible.parallelVersion.id}` : ''}`
					}}
				/>

				{!hasParallel &&
					<Link
						to={buildBibleLink(this.state.selectedVersion, bible.chapter.reference.usfm, bible.version.local_abbreviation)}
						query={{ parallel: LocalStore.get('parallelVersion') || bible.version.id }}
						className="hide-for-small"
						style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							marginRight: 8,
							lineHeight: 1
						}}
					>
						<PlusButton
							className="circle-border"
							height={13}
							width={13}
						/>
						<span
							style={{
								fontSize: 12,
								color: '#979797',
								paddingLeft: 5,
								paddingTop: 2
							}}
						>
							<FormattedMessage id="Reader.header.parallel" />
						</span>
					</Link>
				}

				{hasParallel &&
					<VersionPicker
						{...this.props}
						version={bible.parallelVersion}
						languages={bible.languages.all}
						versions={bible.versions}
						recentVersions={this.state.recentVersions}
						languageMap={bible.languages.map}
						selectedChapter={this.state.selectedChapter}
						alert={this.state.chapterError}
						getVersions={this.getVersions}
						cancelDropDown={this.state.parallelDropDownCancel}
						extraClassNames="hide-for-small parallel-version-picker-container"
						ref={(vpicker) => { this.parallelVersionPickerInstance = vpicker }}
						linkBuilder={(version, usfm, abbr) => {
							return `${buildBibleLink(bible.version.id, usfm, abbr)}?parallel=${version}`
						}}
					/>
				}

				<AudioPopup audio={bible.audio} hosts={hosts} enabled={typeof bible.audio.id !== 'undefined'} />
				<Settings
					onChange={this.handleSettingsChange}
					initialFontSize={fontSize}
					initialFontFamily={fontFamily}
					initialShowFootnotes={showFootnotes}
					initialShowVerseNumbers={showVerseNumbers}
				/>

				{hasParallel &&
					<Link
						to={buildBibleLink(this.state.selectedVersion, bible.chapter.reference.usfm, bible.version.local_abbreviation)}
						className="hide-for-small"
						style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							marginLeft: 15,
							lineHeight: 1
						}}
					>
						<XMark
							className="circle-border"
							height={13}
							width={13}
						/>
						<span
							style={{
								fontSize: 12,
								color: '#979797',
								paddingLeft: 5,
								paddingTop: 2
							}}
						>
							<FormattedMessage id="Reader.header.parallel exit" />
						</span>
					</Link>
				}
			</Header>
	}
}

BibleHeader.propTypes = {

}

BibleHeader.defaultProps = {

}

export default BibleHeader
