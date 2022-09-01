import express from 'express'
const router = express.Router()
import { loggedIn } from '@/api/users/loggedIn'
import { getTtsInfo, preview, makeFile } from '@/api/tts'

router.get('/', loggedIn, async (req, res) => {
  try {
    return res.status(200).json(await getTtsInfo())
  } catch (err) {
    return res.status(500).json(err)
  }
})

router.post('/preview', loggedIn, async (req, res) => {
  try {
    return res.status(200).json(await preview(req.body))
  } catch (err) {
    return res.status(500).json(err)
  }
})

router.post('/makeFile', loggedIn, async (req, res) => {
  try {
    return res.status(200).json(await makeFile(req.body))
  } catch (err) {
    return res.status(500).json(err)
  }
})

export default router
