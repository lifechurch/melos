import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import shareAction from './action'
import FullscreenDrawer from '../../components/FullscreenDrawer'
import Card from '../../components/Card'
import AddThis from '../../components/AddThis'


class ShareSheet extends Component {
	handleClose = () => {
		const { dispatch } = this.props
		dispatch(shareAction({ isOpen: false }))
	}

	render() {
		const { shareData: { isOpen, text, url } } = this.props
		return (
			<FullscreenDrawer
				isOpen={isOpen}
				onClose={this.handleClose}
				className='yv-large-5 yv-small-11 centered'
				title={<FormattedMessage id='share' />}
			>
				<Card customClass='horizontal-center flex-wrap'>
					<div
						className='text-center'
						style={{ fontSize: '24px', width: '100%', margin: '15px 0' }}
					>
						{ text }
					</div>
					<div className='text-center yv-text-ellipsis' style={{ fontSize: '14px', width: '100%' }}>
						{ url }
					</div>
					<div style={{ margin: '25px 0' }}>
						<AddThis
							text={text}
							url={url}
						/>
					</div>
				</Card>
			</FullscreenDrawer>
		)
	}
}

function mapStateToProps(state) {
	return {
		shareData: state.shareData && state.shareData.data,
	}
}

ShareSheet.propTypes = {
	shareData: PropTypes.object,
	dispatch: PropTypes.func.isRequired,
}

ShareSheet.defaultProps = {
	shareData: {
		isOpen: false,
		text: '',
		url: ''
	}
}

export default connect(mapStateToProps, null)(ShareSheet)
