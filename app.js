/** @format */
// val
const httpPort = 3000
const httpsPort = 3443

// common nodesj modules
import path from 'node:path'
import dotenv from 'dotenv'
import { makeFolder } from '@/api/functions'
dotenv.config()

// load db
import '@/db'
import { loggerArr as log } from '@/logger'

// express modules
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import http from 'http'
import httpLogger from 'morgan'
import routes from './routes'

// login n session
import MongoStore from 'connect-mongo'
import passport from 'passport'
import initPassport from '@/api/users/passport'
import session from 'express-session'

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

// session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true
    },
    store: MongoStore.create({
      mongoUrl: `mongodb://127.0.0.1:27017/bs`
    })
  })
)
initPassport()
app.use(passport.initialize())
app.use(passport.session())

// dev mode
if (process.env.NODE_ENV !== 'production') {
  app.use(httpLogger('dev'))
}

// set folder and static
global.filesPath = path.join(__dirname, 'files')
global.tempPath = path.join(__dirname, 'files', 'tmp')
makeFolder(filesPath)
makeFolder(tempPath)
makeFolder(path.join(filesPath, 'Media'))
makeFolder(path.join(filesPath, 'TTS'))
makeFolder(path.join(filesPath, 'Schedules'))

app.use(express.static(path.join(__dirname, 'public')))
app.use('/files', express.static(filesPath))
app.use('/media', express.static(path.join(__dirname, 'Media')))

app.use('/api', routes)

// create server http
const httpServer = http.createServer(app)
httpServer.listen(httpPort, () => {
  log(3, 'Server', `HTTP Server start on port ${httpPort}`)
})
