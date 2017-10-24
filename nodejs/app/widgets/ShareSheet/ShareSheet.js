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
		const { shareData } = this.props
		return (
			<FullscreenDrawer
				isOpen={shareData && shareData.isOpen}
				onClose={this.handleClose}
				className='yv-large-5 yv-small-11 centered'
				title={<FormattedMessage id='share' />}
			>
				<Card customClass='horizontal-center flex-wrap'>
					<div
						className='text-center'
						style={{ fontSize: '24px', width: '100%', margin: '15px 0' }}
					>
						{ shareData && shareData.text }
					</div>
					<div className='text-center' style={{ fontSize: '14px', width: '100%' }}>
						{ shareData && shareData.url }
					</div>
					<div style={{ margin: '25px 0' }}>
						<AddThis
							text={shareData && shareData.text}
							url={shareData && shareData.url}
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
	shareData: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
}

ShareSheet.defaultProps = {

}

export default connect(mapStateToProps, null)(ShareSheet)
