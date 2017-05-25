import { h, Component } from 'preact'
import { color } from './../style'

export default class Html extends Component {
  render() {
    const {
      markup,
    } = this.props

    const style = `
      * {
        margin: 0;
        padding: 0;
      }
      html, body, #app {
        height: 100%;
        background-color: ${color.bg.main}
      }
    `

    return (
      <html lang='ja'>
        <head>
          <meta charSet='utf-8' />
          <style>{style}</style>
        </head>
        <body>
          <div id='app' dangerouslySetInnerHTML={{ __html: markup }} />
          <script src='./stat/bundle.js' />
        </body>
      </html>
    )
  }
}
