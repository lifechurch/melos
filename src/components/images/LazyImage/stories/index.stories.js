import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import Card from '../../../containers/Card'
import LazyImage from '../../LazyImage'

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
        <Usage importString={'import LazyImage from \'@youversion/react-components\''}>
          {`
						This package exports a LazyImage component.
						Use LazyImage for lazy loading images with an animated transition between an optional placeholder and the desired src.
						The src only replaces the placeholder if it is successfully downloaded (i.e. not missing, 0 width, broken etc.).
						The 'lazy' ability can also be false for server rendering.
						Having a placeholder requires explicit dimension properties, but if a dynamic image size is required just forgo the placeholder and pass \`{ width: '100%', height: null }\`
					`}
        </Usage>
			}
    />
  )
}

storiesOf('Images/LazyImage', module)
  .add('Lazy loading image',
    withInfo({
      text: <Docs />
    })(() => {
      return (<div style={{ background: 'whitesmoke', padding: '50px 0' }}>
        <div style={{ width: '1187px', margin: 'auto' }}>
          <Card>
            <LazyImage
              width={1122}
              height={400}
              src="https://firebasestorage.googleapis.com/v0/b/blog-9eb89.appspot.com/o/yosemite_cover.png?alt=media&token=c4dbfe80-e871-406d-b633-24d6496dce27"
              placeholder={(
                <img
                  alt='placeholder'
                  width="100%"
                  height="100%" src='data:image/jpeg;base64,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'
                />
							)}
            />
          </Card>
        </div>
      </div>)
    }
		)
  )
