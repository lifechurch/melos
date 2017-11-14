import React from 'react'

const titleStyle = {
  margin: '20px 0',
  padding: '0px 0px 5px',
  fontSize: '25px',
  borderBottom: '1px solid rgb(238, 238, 238)',
}

/**
 * Template that accepts react components/dom nodes representing each
 * piece of component documentation:
 *   - Maintainer
 * 	 - Installation / links
 *   - Version / changelog
 *   - Usage
 *   - Examples
 *
 */
export default (props) => {
  const {
		maintainer,
		installation,
		version,
		usage,
		examples,
		children
	} = props

  return (
    <div>
      { maintainer && maintainer }
      { installation && installation }
      { version && version }
      { usage && usage }
      {
				examples
					&& (
						<div>
  <h1 style={titleStyle}>Examples</h1>
  { examples }
						</div>
					)
			}
      { children }
    </div>
  )
}

export const Installation = (props) => {
  const {
		maintainer,
		command,
		npm,
		source,
	} = props

  const inlineStyle = {
    display: 'inline-flex',
    width: '100%',
    alignItems: 'center',
    height: '30px'
  }
  const labelStyle = {
    width: '100px',
    textAlign: 'right',
    marginRight: '25px',
    fontWeight: 600
  }

  return (
    <section style={{ padding: '30px 0' }}>
      <div style={inlineStyle}>
        <p style={labelStyle}>Maintainer</p>{ maintainer }
      </div>
      <div style={inlineStyle}>
        <p style={labelStyle}>Install</p><code>{ command }</code>
      </div>
      <div style={inlineStyle}>
        <p style={labelStyle}>npm</p>{ npm }
      </div>
      <div style={inlineStyle}>
        <p style={labelStyle}>Source</p>{ source }
      </div>
    </section>
  )
}

Installation.defaultProps = {
  maintainer: (
    <a href='https://in.thewardro.be/michael.martin'>
			Michael Martin
		</a>
	),
  command: 'npm install @youversion/react-components',
  npm: (
    <a href='https://in.thewardro.be/web/youversion-react-components'>
			@youversion/react-components
		</a>
	),
  source: (
    <a href='https://in.thewardro.be/web/youversion-react-components'>
			Gitlab
		</a>
	)
}

export const Changelog = (props) => {
  const {

	} = props

  return (
    <section>
      <h1 style={titleStyle}>Changelog</h1>
    </section>
  )
}

export const Usage = (props) => {
  const {
		importString,
		children
	} = props

  const codeStyle = {
    width: '100%',
    backgroundColor: '#F4F5F7',
    borderRadius: '3px',
    margin: '16px 0',
    overflowX: 'auto',
    padding: '8px',
  }

  let finalImportString
  if (Array.isArray(importString)) {
    finalImportString = importString.map(() => {
      <code>{ importString }</code>
    })
  }

  if (typeof importString === 'string') {
    finalImportString = <code>{importString}</code>
  }

  return (
    <section>
      <h1 style={titleStyle}>Usage</h1>
      { importString && <div style={codeStyle}>{finalImportString}</div> }
      <div>{ children }</div>
    </section>
  )
}

export const Example = (props) => {
  const {
		title,
		children,
	} = props


  return (
    <div>
      <h3>{ title }</h3>
      { children }
    </div>
  )
}
