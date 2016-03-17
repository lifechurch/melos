import React, { Component } from 'react'

class NoticeBanner extends Component {
	render() {
		return (
			<div className='alert-box secondary notice-banner'>
				<b>Welcome to the New YouVersion Events!</b>
				<p>
					To see Events that you create here, Bible App users will
					need to update their iOS or Android devices with the most
					recent version.
				</p>
			</div>
		)
	}
}

export default NoticeBanner