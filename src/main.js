import { app, BrowserWindow } from 'electron'
import debug from 'electron-debug'
import installExtension from 'electron-devtools-installer'
import webpack from 'webpack'

import config from '../webpack.config.babel'

const CYCLE_DEVELOPER_TOOLS = 'dfgplfmhhmdekalbpejekgfegkonjpfp'

let window = null
let firstRun = true

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('ready', () => {
  window = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
  })

  window.on('closed', () => {
    window = null
  })
})

if (process.env.NODE_ENV === 'development') {
  debug()

  webpack(config).watch({}, (err, stats) => {
    if (err) {
      console.error(err)
    } else {
      process.stdout.write(stats.toString({ colors: true }))

      if (firstRun) {
        installExtension(CYCLE_DEVELOPER_TOOLS)
          .then((name) => {
            window.show()
            window.focus()
            window.openDevTools()
          })
          .catch((err) => console.error('An error occurred: ', err))
      }

      if (!stats.hasErrors()) {
        window.loadURL(`file://${__dirname}/main.html`)
      }

      firstRun = false
    }
  })
}
