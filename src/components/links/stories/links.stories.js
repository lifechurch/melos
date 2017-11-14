import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import Card from '../../containers/Card'
import Button from '../Button'
import ButtonMajor from '../ButtonMajor'
import LinkText from '../LinkText'
import VerticalSpace from '../../layouts/VerticalSpace'
import Theme from '../../themes/Theme'

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
      usage={
        <Usage importString={'import Card from \'@youversion/react-components\''}>
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

storiesOf('Links/Buttons', module)
  .add('Button, ButtonMajor and LinkText',
    withInfo({
      text: <Docs />
    })(() => {
      return (<div style={{ background: 'whitesmoke', padding: '50px 0' }}>
        <div style={{ width: '400px', margin: 'auto' }}>
          <Card>
            <VerticalSpace>
              <ButtonMajor>Button Major</ButtonMajor>
              <Button>Button</Button>
              <LinkText href="https://www.bible.com">Link Text</LinkText>
            </VerticalSpace>
          </Card>
        </div>
      </div>)
    })
  )


const customTheme = {
  constants: {
    color: {
      primary: '#3E50B4',
      light: '#F7F7F7'
    },
    radius: {
      medium: 0
    },
    fontFamily: {
      primary: 'Georgia'
    }
  }
}

const customTheme2 = {
  constants: {
    color: {
      primary: '#FF8C00',
      light: '#F7F7F7'
    },
    radius: {
      medium: 8
    },
    fontFamily: {
      primary: 'fantasy'
    }
  }
}

storiesOf('Links/Buttons with Theme', module)
    .add('Button, ButtonMajor and LinkText',
      withInfo({
        text: <Docs />
      })(() => {
        return (<div style={{ background: 'whitesmoke', padding: '50px 0' }}>
          <div style={{ display: 'flex' }}>
            <Card>
              <VerticalSpace>
                <ButtonMajor>Button Major</ButtonMajor>
                <Button>Button</Button>
                <LinkText href="https://www.bible.com">Link Text</LinkText>
              </VerticalSpace>
            </Card>
            <Theme definition={customTheme}>
              <Card>
                <VerticalSpace>
                  <ButtonMajor>Button Major</ButtonMajor>
                  <Button>Button</Button>
                  <LinkText href="https://www.bible.com">Link Text</LinkText>
                </VerticalSpace>
              </Card>
            </Theme>
            <Theme definition={customTheme2}>
              <Card>
                <VerticalSpace>
                  <ButtonMajor>Button Major</ButtonMajor>
                  <Button>Button</Button>
                  <LinkText href="https://www.bible.com">Link Text</LinkText>
                </VerticalSpace>
              </Card>
            </Theme>
          </div>
        </div>)
      })
    )
