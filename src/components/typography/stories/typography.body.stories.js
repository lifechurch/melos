import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import Heading1 from '../Heading1'
import Body from '../Body'
import LinkText from '../../links/LinkText'
import Card from '../../containers/Card'
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

storiesOf('Typography/Body', module)
  .add('Body copy inside a card',
    withInfo({
      text: <Docs />
    })(() => {
      return (
        <div style={{ background: 'whitesmoke', padding: '50px 0' }}>
          <div style={{ width: '600px', margin: 'auto' }}>
            <Card>
              <VerticalSpace space={15}>
                <Heading1>Romans 8:1-15 WEB</Heading1>
                <Body>
                  There is therefore now no condemnation to those who are in Christ Jesus, who don’t walk according to the flesh, but according to the Spirit.   For the law of the Spirit of life in Christ Jesus made me free from the law of sin and of death.  For what the law couldn’t do, in that it was weak through the flesh, God did, sending his own Son in the likeness of sinful flesh and for sin, he condemned sin in the flesh;  that the ordinance of the law might be fulfilled in us, who walk not after the flesh, but after the Spirit.  For those who live according to the flesh set their minds on the things of the flesh, but those who live according to the Spirit, the things of the Spirit.  For the mind of the flesh is death, but the mind of the Spirit is life and peace;  because the mind of the flesh is hostile towards God; for it is not subject to God’s law, neither indeed can it be.  Those who are in the flesh can’t please God.  But you are not in the flesh but in the Spirit, if it is so that the Spirit of God dwells in you. But if any man doesn’t have the Spirit of Christ, he is not his.  If Christ is in you, the body is dead because of sin, but the spirit is alive because of righteousness.  But if the Spirit of him who raised up Jesus from the dead dwells in you, he who raised up Christ Jesus from the dead will also give life to your mortal bodies through his Spirit who dwells in you.  So then, brothers, we are debtors, not to the flesh, to live after the flesh.  For if you live after the flesh, you must die; but if by the Spirit you put to death the deeds of the body, you will live.  For as many as are led by the Spirit of God, these are children of God.  For you didn’t receive the spirit of bondage again to fear, but you received the Spirit of adoption, by whom we cry, “Abba!  Father!”
                </Body>
                <LinkText target="_blank" href="https://www.bible.com/bible/206/ROM.8.1-15">Romans 8:1-15 WEB</LinkText>
              </VerticalSpace>
            </Card>
          </div>
        </div>
      )
    })
  )
