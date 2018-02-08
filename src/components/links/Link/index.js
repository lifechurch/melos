import React from 'react'
import PropTypes from 'prop-types'
import { Link as RouterLink } from 'react-router'

function Link({ to, href, onClick, children, className, target }) {
  let useClientRouting = false

  const linkProps = {
    className,
    target: target || '_self'
  }

  if (to !== null && ['string', 'object'].indexOf(typeof to) !== -1) {
    useClientRouting = true
    linkProps.to = to
  } else if (href !== null && typeof href === 'string') {
    linkProps.href = href
  }

  if (typeof onClick === 'function') {
    linkProps.onClick = onClick
  }

  return useClientRouting
		? <RouterLink {...linkProps}>{children}</RouterLink>
		: <a {...linkProps}>{children}</a>
}

Link.propTypes = {
  to: PropTypes.oneOfType([ PropTypes.string, PropTypes.object ]),
  href: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.string,
  target: PropTypes.string
}

Link.defaultProps = {
  to: null,
  href: null,
  onClick: null,
  children: null,
  className: '',
  target: null
}

export default Link
