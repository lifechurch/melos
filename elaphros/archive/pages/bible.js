import api from '@youversion/js-api'
import ReaderArrowLeft from '../components/reader-arrow-left'
import ReaderArrowRight from '../components/reader-arrow-right'


/*
<site-layout>
  <@head>
    <await(promiseData from data.allPromises)>
      $ const [ chapter, version ] = promiseData

      $ const title = `
        ${chapter.reference.human},
        ${version.title}
        (${version.abbreviation.toUpperCase()})
      `

      $ const description = chapter
        .content
        .replace(/(<([^>]+)>[0-9]{0,3})/ig, '')
        .trim()
        .substring(0,200)

      <title> ${title} | The Bible App | Bible.com</title>
      <meta name="description" content="${title} ${description}" />
      <meta name="og:title" content="${title}" />
      <meta name="og:description" content="${description}" />
      <meta name="twitter:title" content="${title}" />
      <meta name="twitter:description" content="${description}" />
    </await>
  </@head>
  <@body>
    <await(promiseData from data.allPromises)>
      $ const [ chapter, version ] = promiseData
      <div className="mw6 center">
        <a
          className="fixed dim br-100 ba b--moon-gray pa3 flex items-center justify-center"
          href="/bible/${data.versionId}/${chapter.previous.usfm[0]}"
          title="${chapter.previous.human}"
          style="bottom:45%;left:17%"
        >
          <div className="flex" >
            <reader-arrow-left />
          </div>
        </a>

        <a
          className="fixed dim br-100 ba b--moon-gray pa3 flex items-center justify-center"
          href="/bible/${data.versionId}/${chapter.next.usfm[0]}"
          title="${chapter.next.human}"
          style="bottom:45%;right:17%"
        >
          <div className="flex" >
            <reader-arrow-right />
          </div>
        </a>

        <div className="yv-bible-text">
          <div className="reader">$!{chapter.content}</div>
        </div>
        <div className="f5 lh-copy gray">
          $!{version.copyright_short.html}
        </div>
      </div>
    </await>
  </@body>
</site-layout>
*/

const BiblePage = ({ chapter, version, data }) => (
  <div className="mw6 center">
    <a
      className="fixed dim br-100 ba b--moon-gray pa3 flex items-center justify-center"
      href={`/bible/${data.versionId}/${chapter.previous.usfm[0]}`}
      title={`${chapter.previous.human}`}
      style={{ bottom: '45%', left: '17%' }}
    >
      <div className="flex" >
        <ReaderArrowLeft />
      </div>
    </a>

    <a
      className="fixed dim br-100 ba b--moon-gray pa3 flex items-center justify-center"
      href={`/bible/${data.versionId}/${chapter.next.usfm[0]}`}
      title={`${chapter.next.human}`}
      style={{ bottom: '45%', right: '17%' }}
    >
      <div className="flex" >
        <ReaderArrowRight />
      </div>
    </a>

    <div className="yv-bible-text">
      <div className="reader" dangerouslySetInnerHTML={{ __html: chapter.content }} />
    </div>

    <div className="f5 lh-copy gray" dangerouslySetInnerHTML={{ __html: version.copyright_short.html }} />
  </div>
)

BiblePage.getInitialProps = async ({ req }) => {
  // const { versionId, usfm } = req.params
  const versionId = 1
  const usfm = "JHN.1"

  const Bible = api.getClient('bible')

  const chapterPromise = Bible.call("chapter").params({
    id: versionId,
    reference: usfm
  }).setEnvironment(process.env.NODE_ENV).get()

  const versionPromise = Bible.call("version").params({
    id: versionId
  }).setEnvironment(process.env.NODE_ENV).get()

  const [ chapter, version ] = await Promise.all([ chapterPromise, versionPromise ])
  return { chapter, version, data: { versionId, usfm } }
}

export default BiblePage
