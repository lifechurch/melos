import React, { Component, PropTypes } from 'react'
import Modal from 'react-modal'
import RevManifest from '../../../../../../rev-manifest.json'

class ContentHelpModal extends Component {

    handleConfirm() {
        const { handleDelete, modalState } = this.props
        handleDelete(modalState.data)
    }

    render() {
        const customStyles = {
		overlay: {
			overflowX: 'hidden',
			overflowY: 'auto'
		},
		content: {
			bottom: 'auto',
			left: '50%',
			right: 'auto',
			marginRight: '-50%',
			width: '500px',
			transform: 'translateX(-50%)'
		}
        };

        const { modalState, handleClose } = this.props

        let isOpen = false
        let loc = {}
        if (typeof modalState === 'object') {
            loc = modalState.data
            isOpen = modalState.isOpen
        }

        return (
            <Modal isOpen={isOpen} style={customStyles} className='modal__contenthelpmodal'>
                <a className='right modal__close' onClick={handleClose}><img src={`/images/${RevManifest['thin-x.png']}`} /></a>

                <h3>Content Types</h3>
                <h6>Text Module</h6>
		<a className="learnLink">Learn how to make <br>a great Event</br></a>
		<p className="textModule">Outlines, key points, discussion questions… Share any text-based general content that will help your attenders follow along with your message as it’s happening. Your text modules can be any length and can include rich text formatting.</p>
                <h6>Bible Reference Module</h6>
		<p>Select any Bible verse or passage, linked directy to any of YouVersion’s 1,200+ versions, in 900+ languages. People viewing your Event can tap your reference to see it in their Bible App reader, where they can Bookmark it, Highlight it, and more.</p>
                <h6>Plan Module</h6>
		<p>Link to Bible Plans and Devotionals that relate to your teaching points, helping your audience continue to engage with God’s Word throughout the week.</p>
                <h6>Image Module</h6>
		<p>Bring your Event to life with any kind of supporting graphics: series art, photos, Verse Images etc. Attenders will be able to easily share your Event images to their social media, taking your message viral.</p>
                <h6>External Link Module</h6>
		<p>Creates a button inside your Event that links to any external website. Put your audience just one tap away from online giving, volunteer signup, or church home pages.</p>
                <h6>Announcement Module</h6>
		<p>Church news, calendar events, programs, classes, volunteer and missions opportunities… Easily distribute timely, important information without distracting from the primary message of your Event. Your announcement modules can This content type allows you to post rich text content which appears on it’s own page in the event. It’s perfect for content that’s important but you don’t want it to distract from primary message of your event.</p>
            </Modal>
        )
    }

}

export default ContentHelpModal
