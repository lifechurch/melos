import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import Body from '../Body'
import Caption1 from '../Caption1'
import Caption2 from '../Caption2'
import Heading1 from '../Heading1'
import Heading2 from '../Heading2'
import Heading3 from '../Heading3'
import VerticalSpace from '../../layouts/VerticalSpace'
import Title from '../Title'

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

storiesOf('Typography/All', module)
  .add('All typography',
    withInfo({
      text: <Docs />
    })(() => {
      return (
        <VerticalSpace space={15} padding={40} textAlign="center">
          <Heading1>Heading One</Heading1>
          <Heading1 muted>Heading One</Heading1>
          <Heading2>Heading Two</Heading2>
          <Heading2 muted>Heading Two</Heading2>
          <Heading3>Heading Three</Heading3>
          <Heading3 muted>Heading Three</Heading3>
          <Title>Title</Title>
          <Title muted>Title</Title>
          <Body>Body</Body>
          <Body muted>Body</Body>
          <Caption1>Caption One</Caption1>
          <Caption1 muted>Caption One</Caption1>
          <Caption2>Caption Two</Caption2>
          <Caption2 muted>Caption Two</Caption2>
        </VerticalSpace>
      )
    }
		)
  )
