import { loggerArr as log } from '@/logger'
import User from '@/db/models/user'

export async function getUsers(req, res) {
  try {
    res.json({ users: await User.find({}, { password: 0 }) })
  } catch (err) {
    log(5, 'Server', `사용자정보확인오류: ${err}`)
    return res.status(500).json(err)
  }
}

export async function setAdmin(req, res) {
  try {
    const user = JSON.parse(req.query.item)
    await User.findByIdAndUpdate(user._id, { $set: { admin: !user.admin } })
    log(3, 'Server', `관리자권한변경: ${user.email}, ${!user.admin}`)
    res.status(200).send(null)
  } catch (err) {
    log(5, 'Server', `관리자권한변경오류: ${err}`)
    return res.status(500).json(err)
  }
}

export async function deleteUser(req, res) {
  try {
    const user = JSON.parse(req.query.item)
    if (req.user.admin || req.user.email === user.email) {
      await User.deleteOne({ email: user.email })
      log(3, req.user, `사용자삭제: ${user.email}`)
      if (req.user.email === user.email) {
        req.logout()
      }
      return res.status(200).send(null)
    }
    return res.status(403).send(null)
  } catch (err) {
    log(5, req.user, '사용자삭제오류')
    return res.status(500).json(err)
  }
}
