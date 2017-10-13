import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import shareAction from './action'
import DropdownTransition from '../../components/DropdownTransition'
import Card from '../../components/Card'
import XMark from '../../components/XMark'


class ShareSheet extends Component {
	handleClose = () => {
		const { dispatch } = this.props
		dispatch(shareAction({ isOpen: false }))
	}

	render() {
		const { shareData } = this.props
		console.log('SHARE DATA', shareData)
		return (
			<div className="yv-fullscreen-modal-container">
				<DropdownTransition
					show={shareData && shareData.isOpen}
					hideDir="down"
					transition={true}
					classes="yv-fullscreen-modal-content"
				>
					<div className='large-5 small-11 centered' style={{ padding: '50px 0' }}>
						<a
							tabIndex={0}
							className="flex-end"
							onClick={this.handleClose}
							style={{ marginBottom: '25px' }}
						>
							<XMark width={20} height={20} fill="#444444" />
						</a>
						<Card>
							SHARE
						</Card>
					</div>
				</DropdownTransition>
			</div>
		)
	}
}

function mapStateToProps(state) {
	return {
		shareData: state.shareData && state.shareData.data,
	}
}

ShareSheet.propTypes = {
	dispatch: PropTypes.func.isRequired,
}

ShareSheet.defaultProps = {

}

export default connect(mapStateToProps, null)(ShareSheet)
