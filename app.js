/** @format */
// val
const httpPort = 3000
const httpsPort = 3443

// common nodesj modules
import path from 'node:path'

// load db
import '@/db'
import { loggerArr as log } from '@/logger'

// express modules
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import http from 'http'

import httpLogger from 'morgan'

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
app.use(
  cors({
    origin: (origin, cb) => {
      cb(null, origin)
    },
    credentials: true
  })
)
// dev mode
if (process.env.NODE_ENV !== 'production') {
  app.use(httpLogger('dev'))
}

// create server http
const httpServer = http.createServer(app)
httpServer.listen(httpPort, () => {
  log(3, 'Server', `HTTP Server start on port ${httpPort}`)
})
