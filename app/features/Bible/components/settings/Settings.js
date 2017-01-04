import React, { Component, PropTypes } from 'react'
import FontSettingsTriggerImage from './FontSettingsTriggerImage'
import TriggerButton from '../../../../components/TriggerButton'
import ButtonBar from '../../../../components/ButtonBar'
import Toggle from '../../../../components/Toggle'
import LocalStore from '../../../../lib/localStore'
import DropdownTransition from '../../../../components/DropdownTransition'
import { FormattedMessage } from 'react-intl'

class Settings extends Component {
	constructor(props) {
		super(props)

		this.state = {
			isOpen: false
		}

		this.triggerClick = ::this.triggerClick
		this.handleFontSizeChange = ::this.handleFontSizeChange
		this.handleFontFamilyChange = ::this.handleFontFamilyChange
		this.handleFootnotesToggle = ::this.handleFootnotesToggle
		this.handleVerseNumbersToggle = ::this.handleVerseNumbersToggle
		this.onChange = ::this.onChange

		this.fontSizes = [
			{ value: 14, label: (<FontSettingsTriggerImage height={12} width={18} />) },
			{ value: 18, label: (<FontSettingsTriggerImage height={16} width={24} />) },
			{ value: 22, label: (<FontSettingsTriggerImage height={20} width={30} />) }
		]

		this.fontFamilies = [
			{ value: 'Tisa Pro', label: (<span style={{ fontFamily: 'Tisa Pro' }}>Tisa Pro</span>) },
			{ value: 'Avenir', label: (<span style={{ fontFamily: 'Avenir' }}>Avenir</span>) },
			{ value: 'Georgia', label: (<span style={{ fontFamily: 'Georgia' }}>Georgia</span>) },
			{ value: 'Proxima Nova', label: (<span style={{ fontFamily: 'Proxima Nova' }}>Proxima Nova</span>) }
		]
	}

	onChange(key, value) {
		const { onChange } = this.props
		if (typeof onChange === 'function') {
			onChange(key, value)
		}
	}

	triggerClick(isOpen) {
		this.setState({ isOpen: !this.state.isOpen })
	}

	handleFontSizeChange(item) {
		this.onChange("reader.settings.fontSize", item.value)
	}

	handleFontFamilyChange(item) {
		this.onChange("reader.settings.fontFamily", item.value)
	}

	handleFootnotesToggle(value) {
		this.onChange("reader.settings.showFootnotes", value)
	}

	handleVerseNumbersToggle(value) {
		this.onChange("reader.settings.showVerseNumbers", value)
	}

	closeDropdown = () => {
		this.setState({
			isOpen: false,
		})
	}

	render() {
		const { initialFontSize, initialFontFamily, initialShowFootnotes, initialShowVerseNumbers } = this.props

		return (
			<div className='reader-settings'>
				<TriggerButton image={<FontSettingsTriggerImage />} onClick={this.triggerClick} />
				<DropdownTransition show={this.state.isOpen} classes={'reader-settings-modal'} onOutsideClick={this.closeDropdown} exemptClass='reader-settings'>
					<div className="header vertical-center horizontal-center"><FormattedMessage id="Reader.header.font label" /></div>
					<div className="body">
						<ButtonBar items={this.fontSizes} onClick={this.handleFontSizeChange} initialValue={initialFontSize} />
						<ButtonBar items={this.fontFamilies} onClick={this.handleFontFamilyChange} cols={2} initialValue={initialFontFamily} />
						<Toggle label={<FormattedMessage id='Reader.reader settings.footnotes' />} onClick={this.handleFootnotesToggle} initialValue={initialShowFootnotes} />
						<Toggle label={<FormattedMessage id='Reader.reader settings.numbers' />} onClick={this.handleVerseNumbersToggle} initialValue={initialShowVerseNumbers} />
					</div>
				</DropdownTransition>
			</div>
		)
	}
}

Settings.propTypes = {
	onChange: React.PropTypes.func,
	initialFontSize: React.PropTypes.number,
	initialFontFamily: React.PropTypes.string,
	initialShowFootnotes: React.PropTypes.bool,
	initialShowVerseNumbers: React.PropTypes.bool
}

Settings.defaultProps = {
	initialFontFamily: 'Arial',
	initialFontSize: 18,
	initialShowFootnotes: true,
	initialShowVerseNumbers: true
}

export default Settings