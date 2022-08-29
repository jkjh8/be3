import { loggerArr as logger } from '@/logger'
import Eventlog from '@/db/models/eventlog'
import Hangul from 'hangul-js'
import { Parser } from 'json2csv'

export const getEventlog = async (req, res) => {
  try {
    const { limit, page, search } = JSON.parse(req.query.options)
    const searchOptions = []
    if (!req.user.admin) {
      searchOptions.push({ level: { $lt: 3 } })
    }
    if (search) {
      searchOptions.push({
        search: new RegExp(Hangul.disassembleToString(search))
      })
    }
    const paginateOptions = { page, limit, sort: { createdAt: -1 } }
    return res.json(
      await Eventlog.paginate(
        searchOptions.length ? { $and: searchOptions } : {},
        paginateOptions
      )
    )
  } catch (err) {
    logger(5, 'Server', `이벤트로그오류: ${err}`)
  }
}

export const downloadLog = async (req, res) => {
  try {
    const { start, end } = JSON.parse(req.query.options)
    const r = await Eventlog.find({ createdAt: { $gte: start, $lte: end } })
    const fields = ['createdAt', 'priority', 'id', 'zones', 'message']
    const opts = { fields }
    const parser = new Parser(opts)
    const csv = parser.parse(r)
    res.status(200).send(csv)
  } catch (err) {
    logger(5, req.user, `이벤트로그다운로드오류: ${err}`)
    return res.status(500).json(err)
  }
}

export const deleteAllEventlog = async (req, res) => {
  try {
    await Eventlog.deleteMany({})
    logger(3, req.user, '전체 이벤트로그를 삭제 하였습니다.')
    return res.status(200).send(null)
  } catch (err) {
    logger(5, req.user, `전체이벤트로그삭제오류 ${err}`)
    return res.status(500).json(err)
  }
}
