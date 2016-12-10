import React, { Component, PropTypes } from 'react'
import ActionCreators from '../../../actions/creators'
import { FormattedMessage } from 'react-intl'
import moment from 'moment-timezone'
import XMark from '../../../../../components/XMark'
import DropdownTransition from '../../../../../components/DropdownTransition'
import VerseCard from './VerseCard'
import LabelSelector from './LabelSelector'
import ColorList from '../ColorList'
import Color from '../Color'

class Bookmark extends Component {

	constructor(props) {
		super(props)
		this.state = {
			addedLabels: {},
			dropdown: false,
			selectedColor: null,
		}
	}

	componentDidMount() {
		const { isLoggedIn } = this.props
		// redirect to sign in page
		if (!isLoggedIn) {
			window.location.replace('/sign-in')
		}
	}

	handleDropdownClick = () => {
		this.setState({
			dropdown: !this.state.dropdown,
		})
	}

	addColor = (color) => {
		this.setState({
			selectedColor: color,
		})
		this.handleDropdownClick()
	}

	// called by LabelSelector when labels are added or deleted
	updateLabels = (labels) => {
		this.setState({
			addedLabels: Object.keys(labels),
		})
	}

	saveBookMark = () => {
		const { dispatch, isLoggedIn, references } = this.props
		const { addedLabels } = this.state
		dispatch(ActionCreators.momentsCreate(isLoggedIn, {
			kind: 'bookmark',
			references: references,
			labels: addedLabels,
			created_dt: moment().format(),
		}))
	}


	render() {
		const { verses, labels, colors } = this.props
		const { dropdown, selectedColor } = this.state

		let labelsDiv, colorsDiv = null

		labelsDiv = <LabelSelector byAlphabetical={labels.byAlphabetical} byCount={labels.byCount} updateLabels={this.updateLabels} />

		if (colors) {
			colorsDiv = (
				<div className='colors-div'>
					<div onClick={this.handleDropdownClick} className='color-trigger-button'>
						{
							selectedColor
							?
							<Color color={selectedColor} />
							:
							<div className='yv-gray-link'><FormattedMessage id='add color' /></div>
						}
					</div>
					<DropdownTransition show={dropdown} hideDir='right'>
						<div className='labels-modal'>
							<ColorList list={colors} onClick={this.addColor} />
						</div>
					</DropdownTransition>
				</div>
			)
		}
		return (
			<div className='verse-action-create'>
				<div className='row large-6'>
					<div className='heading vertical-center'>
						<div className='columns medium-4 cancel'><XMark width={18} height={18} /></div>
						<div className='columns medium-4 title'><FormattedMessage id='bookmark' /></div>
						<div className='columns medium-4 save'>
							<div onClick={this.saveBookMark} className='solid-button green'>Save</div>
						</div>
					</div>
					<VerseCard verseContent={verses}>
							<div className='small-10'>
								{ labelsDiv }
							</div>
							<div className='small-2'>
								{ colorsDiv }
							</div>
					</VerseCard>
				</div>
			</div>
		)
	}
}

/**
 * create new bookmark from selected verses
 *
 * @verses				{object} 				verses object containing verse objects. passed to verse card
 * @references		{array}					array of usfms formatted for the momentsCreate API call
 * @labels				{object}				labels object containing an array of labels sorted alphabetically
 * 																and an array sorted by count
 */
Bookmark.propTypes = {
	verses: React.PropTypes.object,
	references: React.PropTypes.array,
	labels: React.PropTypes.object,
	colors: React.PropTypes.array,
}

export default Bookmark