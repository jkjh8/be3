import express from 'express'
const router = express.Router()

import { loggedIn, isAdmin } from '@/api/users/loggedIn'
import { getEventlog, downloadLog, deleteAllEventlog } from '@/api/logs'

router.get('/', loggedIn, getEventlog)
router.get('/download', loggedIn, downloadLog)
router.get('/deleteall', isAdmin, deleteAllEventlog)

export default router
