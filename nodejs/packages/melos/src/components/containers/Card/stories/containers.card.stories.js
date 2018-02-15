import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import Card from '../index'
import Body from '../../../typography/Body'
import DocTemplate, {
	Installation,
	Changelog,
	Usage,
	Example
} from '../../../../../stories/Docs'

const Docs = () => {
  return (
    <DocTemplate
      installation={
        <Installation
          maintainer={
            <a href='https://in.thewardro.be/jacob.allenwood'>
							Jacob Allenwood
						</a>
					}
        />
			}
      usage={
        <Usage importString={'import Card from \'@youversion/melos/dist/containers/Card\''}>
          {`
						This package exports a Card component.
						\n\n
						Use the Card component to encapsulate content.
					`}
        </Usage>
			}
    />
  )
}

storiesOf('Containers/Card', module)
  .add('Container component that renders children on a card',
    withInfo({
      text: <Docs />
    })(() => {
      return (<div style={{ background: 'whitesmoke', padding: '50px 0' }}>
        <div style={{ width: '400px', margin: 'auto' }}>
          <Card>
            <Body>This is, most assuredly, text passed as a child.</Body>
          </Card>
        </div>
      </div>)
    }
		)
  )
