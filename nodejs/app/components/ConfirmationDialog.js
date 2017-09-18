import React, { PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'

function ConfirmationDialog(props) {
	const {
		prompt,
		subPrompt,
		confirmPrompt,
		cancelPrompt,
		handleConfirm,
		handleCancel,
	} = props

	return (
		<div className='confirmation-dialog horizontal-center flex-wrap'>
			<div className='prompt-wrapper horizontal-center flex-wrap'>
				<div className='prompt text-center'>
					{ prompt }
				</div>
				{
					subPrompt &&
					<div className='sub-prompt'>
						{ subPrompt }
					</div>
				}
			</div>
			<div className='actions horizontal-center'>
				<button
					className='yv-gray-link'
					onClick={handleCancel}
				>
					{ cancelPrompt }
				</button>
				<button
					className='yv-green-link'
					onClick={handleConfirm}
				>
					{ confirmPrompt }
				</button>
			</div>
		</div>
	)
}

ConfirmationDialog.propTypes = {
	prompt: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
	subPrompt: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
	confirmPrompt: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
	cancelPrompt: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
	handleConfirm: PropTypes.func,
	handleCancel: PropTypes.func,
}

ConfirmationDialog.defaultProps = {
	prompt: (
		<FormattedMessage
			id='features.EventEdit.features.location.components.LocationDeleteModal.sure'
		/>
	),
	subPrompt: null,
	confirmPrompt: <FormattedMessage id='ui.yes button' />,
	cancelPrompt: (
		<FormattedMessage
			id='features.EventEdit.features.location.components.LocationDeleteModal.cancel'
		/>
	),
	handleCancel: null,
	handleConfirm: null,
}

export default ConfirmationDialog
