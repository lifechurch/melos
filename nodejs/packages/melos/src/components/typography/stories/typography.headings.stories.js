import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import Heading1 from '../Heading1'
import Heading2 from '../Heading2'
import Heading3 from '../Heading3'
import VerticalSpace from '../../layouts/VerticalSpace'


import DocTemplate, {
	Installation,
	Changelog,
	Usage,
	Example
} from '../../../../stories/Docs'

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
    />
  )
}

storiesOf('Typography/Headings', module)
  .add('Heading styles',
    withInfo({
      text: <Docs />
    })(() => {
      return (
        <VerticalSpace space={15} padding={40}>
          <Heading1>Heading One</Heading1>
          <Heading1 muted>Heading One</Heading1>
          <Heading2>Heading Two</Heading2>
          <Heading2 muted>Heading Two</Heading2>
          <Heading3>Heading Three</Heading3>
          <Heading3 muted>Heading Three</Heading3>
        </VerticalSpace>
      )
    }
		)
  )
