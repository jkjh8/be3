import { loggerArr as log } from '@/logger'
import Zones from '@/db/models/zones'
import { zoneToStr } from '@/api/functions'

export async function getZones(req, res) {
  try {
    return res.status(200).json(
      await Zones.find({})
        .populate('core')
        .populate({ path: 'children', options: { retainNullValues: true } })
    )
  } catch (err) {
    log(5, req.user, `지역오류: ${err}`)
  }
}

export async function addZone(req, res) {
  try {
    const zone = new Zones({ ...req.body })
    const r = await zone.save()
    log(3, req.user, `지역추가: ${zoneToStr(req.body)}`)
    return res.status(200).json(r)
  } catch (err) {
    log(5, req.user, `지역추가오류: ${err}`)
    return res.status(500).json(err)
  }
}

export async function editZone(req, res) {
  try {
    const r = await Zones.updateOne({ _id: req.body._id }, { $set: req.body })
    log(3, req.user, `지역수정: ${zoneToStr(req.body)}`)
    res.status(200).json(r)
  } catch (err) {
    log(5, req.user, `지역수정중오류: ${err}`)
    return res.status(500).json(err)
  }
}

export async function checkIndex(req, res) {
  try {
    const { index, id } = JSON.parse(req.params.value)
    return res.status(200).json({
      result: await Zones.exists({
        $and: [{ index: index }, { _id: { $ne: id } }]
      })
    })
  } catch (err) {
    log(5, req.user, `지역인덱스확인오류: ${err}`)
    res.status(500).json(err)
  }
}

export async function checkCore(req, res) {
  try {
    const { coreId, zoneId } = JSON.parse(req.params.value)
    console.log(coreId, zoneId)
    return res.status(200).json({
      result: await Zones.exists({
        $and: [{ core: coreId }, { _id: { $ne: zoneId } }]
      })
    })
  } catch (err) {
    log(5, req.user, `지역코어중복확인오류: ${err}`)
    res.status(500).json(err)
  }
}

export async function deleteZone(req, res) {
  try {
    const zone = JSON.parse(req.params.value)
    const r = await Zones.deleteOne({ _id: zone._id })
    log(3, req.user, `지역삭제: ${zoneToStr(zone)}`)
    return res.status(200).json(r)
  } catch (err) {
    log(5, req.user, `지역삭제오류: ${err}`)
    return res.status(500).json(r)
  }
}
