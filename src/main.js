import {exec} from 'child_process'
import { app, BrowserWindow } from 'electron'
import debug from 'electron-debug'
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer'
import chokidar from 'chokidar'
import {compile} from 'node-elm-compiler'
import dotenv from 'dotenv'

dotenv.config()
debug()

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
  function elmCompile() {
    compile(["./src/Main.elm"], {
      output: "dist/main.js"
    })
    .on('close', (exitCode) => {
      if (exitCode === 0) {
        window.loadURL(`file://${__dirname}/main.html`)

        if (firstRun) {
          window.show()
          window.focus()
          window.openDevTools()
          firstRun = false
        }
      }
    })
  }

  chokidar.watch('**/*.elm', {
    persistent: true
  })
  .on('change', elmCompile)

  elmCompile()
}
