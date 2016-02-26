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
            content : {
                top                   : '50%',
                left                  : '50%',
                right                 : 'auto',
                bottom                : 'auto',
                marginRight           : '-50%',
                width                 : '500px',
                transform             : 'translate(-50%, -50%)'
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
                <h6>Text</h6>
                <p>This is general content. It can be any length and include rich text formatting.</p>
                <h6>Bible Reference</h6>
                <p>Choose any Bible reference from over 1200 versions in xx languages. People viewing your event can quickly access that scripture inside their Bible App's reader allowing them to bookmark, highlight, etc.</p>
                <h6>Plan</h6>
                <p>Suggest a related Reading Plab so that attenders can go deeper throughout the week.</p>
                <h6>Image</h6>
                <p>Include a supporting graphic or photo.</p>
                <h6>External Link</h6>
                <p>Create a button in your event that links out to an external website. AN example would be to create a Donate or Give link.</p>
                <h6>Announcement</h6>
                <p>This content type allows you to post rich text content which appears on it's own page in teh event. It's perfect for content that's important but you don't want it to distract from primary message of your event.</p>

            </Modal>
        )
    }

}

export default ContentHelpModal
