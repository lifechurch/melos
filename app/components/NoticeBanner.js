import React, { Component } from 'react'

class NoticeBanner extends Component {
	render() {
		return (
			<div className='alert-box alert notice-banner'>
				<b>Welcome to the New YouVersion Events!</b>
				<p>
					Events that you create using this website will not be visible
					to users before March 14. (For any events taking place
					before March 14, use our original YouVersion Live website.)
					To see Events that you create here, Bible App users will
					need to update their iOS or Android devices with the most
					recent version.
				</p>
			</div>
		)
	}
}

export default NoticeBanner