import React from 'react'
import PropTypes from 'prop-types'
import { injectIntl } from 'react-intl'
import { Link } from 'react-router'
import Card from './Card'


function VerseCard(props) {
	const {
		verseContent,
		heading,
		human,
		link,
		local_abbreviation,
		intl,
		children
	} = props

	let cardFooter = null
	let verse = null

	const header = heading || <h2 className='heading'>{ `${human} ${local_abbreviation}` }</h2>

	/* eslint-disable react/no-danger */
	if (link) {
		verse = (
			<div className='verse'>
				{ header }
				<Link
					to={link}
					title={`${intl.formatMessage({ id: 'Reader.read reference' }, { reference: `${human}` })} ${local_abbreviation}`}
				>
					<div className='verse-content' dangerouslySetInnerHTML={{ __html: verseContent }} />
				</Link>
			</div>
		)
	} else {
		verse = (
			<div className='verse'>
				{ header }
				<div className='verse-content' dangerouslySetInnerHTML={{ __html: verseContent }} />
			</div>
		)
	}


	// this is for rendering an additional component(s) at the footer for
	// specific action (label selector for book mark, reference selector for note, etc)
	if (children) {
		cardFooter = (
			<div className='card-footer'>
				{ children }
			</div>
		)
	}

	return (
		<Card>
			<div className='verse-card'>
				{ verse }
				{ cardFooter }
			</div>
		</Card>
	)
}


VerseCard.propTypes = {
	verseContent: PropTypes.string,
	human: PropTypes.string,
	local_abbreviation: PropTypes.string,
	heading: PropTypes.node,
	link: PropTypes.string,
	children: PropTypes.any,
	intl: PropTypes.object.isRequired
}

VerseCard.defaultProps = {
	verseContent: null,
	human: null,
	link: null,
	heading: null,
	children: null,
	local_abbreviation: null
}

export default injectIntl(VerseCard)
