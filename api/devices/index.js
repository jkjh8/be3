import Devices from '@/db/models/devices'
import { loggerArr as log } from '@/logger'
import { objTokv } from '@/api/functions'
import { Worker } from 'worker_threads'
import { loggerArr } from '../../logger'

const status = {}
const workerPool = {}

function runQsysWorker(args) {
  if (workerPool[args.index]) return 'Already Connected'
  const worker = new Worker('./qsys/worker.js', { workerData: args.ipaddress })
  worker.on('message', (msg) => {
    switch (msg.type) {
      case 'connect':
        workerPool[args.index] = worker
        log(
          3,
          'Server',
          `Q-Sys connected index: ${args.index} ipaddress: ${args.ipaddress}`
        )
        break
      case 'close':
        workerPool[args.index] = null
        log(
          4,
          'Server',
          `Q-Sys Closed index: ${args.index} ipaddress: ${args.ipaddress}`
        )
        break
      case 'error':
        workerPool[args.index] = null
        log(
          4,
          'Server',
          `Q-Sys Error index: ${args.index} ipaddress: ${args.ipaddress} error: ${msg.err}`
        )
        break
      case 'message':
        switch (msg.message.id) {
          case 'GetStatus':
            status[args.index]['status'] = msg.message.result
            break
          case 'GetPa':
            status[args.index]['pa'] = msg.message.result
            break
          default:
            console.log('qsys result', msg.message)
            break
        }
        break
    }
  })
}

function getBarixInfo(args) {
  const worker = new Worker('./barix/worker.js', { workerData: args })
  worker.on('message', (msg) => {
    switch (msg.type) {
      case 'message':
        status[args.index] = msg.data
        break
      case 'error':
        status[args.index] = null
        break
    }
  })
}

export async function getDevices(req, res) {
  try {
    return res.status(200).json(await Devices.find({}).sort({ index: 1 }))
  } catch (err) {
    log(5, req.user, `디바이스리스트오류: ${err}`)
    return res.status(500).json(err)
  }
}

export async function getStatus(req, res) {
  try {
    return res.status(200).json(status)
  } catch (err) {
    log(5, req.user, `디바이스상태오류: ${err}`)
    return res.status(500).json(err)
  }
}

export async function addDevice(req, res) {
  try {
    const device = new Devices({ ...req.body })
    const r = await device.save()
    log(3, req.user, `디바이스추가: ${await objTokv(req.body)}`)
    return res.status(200).json(r)
  } catch (err) {
    log(5, req.user, `디바이스추가오류: ${err}`)
    return res.status(500).json(err)
  }
}

export async function editDevice(req, res) {
  try {
    const r = await Devices.findOneAndUpdate({ _id: req.body._id }, req.body)
    log(3, req.user, `디바이스수정: ${objTokv(req.body)}`)
    res.status(200).json(r)
  } catch (err) {
    log(5, req.user, `디바이스수정오류: ${err}`)
    return res.status(500).json(err)
  }
}

export async function deleteDevice(req, res) {
  try {
    const item = JSON.parse(req.params.value)
    const r = await Devices.deleteOne({ _id: item._id })
    log(3, req.user, `디바이스삭제: ${objTokv(item)}`)
    return res.status(200).json(r)
  } catch (err) {
    log(5, req.user, `디바이스삭제오류: ${err}`)
    return res.status(500).json(err)
  }
}

export async function checkIndex(req, res) {
  try {
    const { index, id } = JSON.parse(req.params.value)
    return res.status(200).json({
      result: await Devices.exists({
        $and: [{ index: index }, { _id: { $ne: id } }]
      })
    })
  } catch (err) {
    log(5, req.user, `디바이스인덱스확인오류: ${err}`)
    res.status(500).json(err)
  }
}

export async function checkIpaddress(req, res) {
  try {
    const { ipaddress, id } = JSON.parse(req.params.value)
    console.log(ipaddress, id)
    return res.status(200).json({
      result: await Devices.exists({
        $and: [{ ipaddress: ipaddress }, { _id: { $ne: id } }]
      })
    })
  } catch (err) {
    log(5, req.user, `디바이스아이피확인오류: ${err}`)
    res.status(500).json(err)
  }
}

export async function deviceRefresh(req, res) {
  try {
    const { ipaddress, deviceType, mode } = JSON.parse(req.params.value)
  } catch (err) {
    log(5, req.user, `디바이스갱신오류: ${err}`)
    res.status(500).json(err)
  }
}
