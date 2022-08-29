import express from 'express'
const router = express.Router()

import auth from './auth'
import eventlog from './eventlog'
import devices from './devices'
import zones from './zones'

router.get('/', (req, res, next) => {
  res.send('<h2>API First Page</h2>')
})

// router.use('/admin', import'./admin'))
router.use('/auth', auth)
router.use('/eventlog', eventlog)
router.use('/device', devices)
router.use('/zones', zones)

export default router
