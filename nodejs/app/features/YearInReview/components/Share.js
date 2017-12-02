import React, { Component, PropTypes } from 'react'
import { FormattedMessage } from 'react-intl'
import ClickTarget from '../../../components/ClickTarget'
import AddThis from '../../../components/AddThis'

class Share extends Component {
  constructor(props) {
    super(props)
    this.state = { isOpen: false }
  }

  onClose = () => {
    const { isOpen } = this.state
    if (isOpen) {
      this.setState({ isOpen: false })
    }
  }

  handleClick = () => {
    console.log("HANDLING CLICK");
    this.setState({ isOpen: !this.state.isOpen })
  }

  render() {
    const { label, text, url } = this.props
    const { isOpen } = this.state
    const classes = isOpen ? 'va-share-open' : 'va-share-closed'

    return (
      <div className={'va-share'}>
        <a className="yv-green-link" onClick={this.handleClick}>
          <FormattedMessage id="share" />
        </a>
        <div className='va-share-panel-wrapper'>
          <div className={`va-share-panel ${classes}`}>
            <div className='va-share-header'>{label}</div>
            <AddThis text={text} url={url} title={`${text} ${label}`} />
          </div>
        </div>
      </div>
    )
  }
}

Share.propTypes = {
  label: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired
}

Share.defaultProps = {
  label: '',
  text: '',
  url: ''
}

export default Share
