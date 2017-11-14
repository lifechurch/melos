import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Div } from 'glamorous'
import SectionedLayout from '../../layouts/SectionedLayout'
import XMark from '../../icons/XMark'
import Link from '../../links/Link'

class Error extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isClosed: false,
      message: '',
      ready: false
    }
  }

  componentWillMount() {
    setTimeout(() => {
      this.setState({ ready: true })
    }, 300)
  }

  componentWillReceiveProps(nextProps) {
    const { show: nextShow } = nextProps
    const { show } = this.props

    if (show !== nextShow) {
      this.setState({ isClosed: false })
    }
  }

  handleClose = () => {
    this.setState({ isClosed: true })
  }

  render() {
    const { show, message } = this.props
    const { ready, isClosed } = this.state

    return (
      <Div
        backgroundColor="red"
        position="fixed"
        top={0}
        left={0}
        width="fill-available"
        padding={32}
        color="#FFFFFF"
        transition="opacity 0.25s ease-in-out, transform 0.25s ease-in-out"
        transform={`translateY(${(show && ready && !isClosed) ? '0' : '-100%'})`}
        opacity={`${(show && ready && !isClosed) ? '1' : '0'}`}
      >
        <SectionedLayout
          right={
            <Link onClick={this.handleClose}>
              <XMark height={15} fill="#FFFFFF" />
            </Link>
					}
        >
          {message}
        </SectionedLayout>
      </Div>
    )
  }
}

Error.propTypes = {
  show: PropTypes.bool,
  message: PropTypes.string
}

Error.defaultProps = {
  show: false,
  message: null
}

export default Error
