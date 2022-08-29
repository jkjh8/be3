import { workerData, parentPort } from 'worker_threads'
import QRC from './qsysqrc'

if (workerData) {
  let core = new QRC(workerData)

  core.on('connect', (msg) => {
    parentPort.postMessage({ type: 'connect', msg: msg })
  })

  core.on('close', () => {
    parentPort.postMessage({ type: 'close' })
  })

  core.on('error', (err) => {
    parentPort.postMessage({ type: 'error', err: err })
  })

  core.on('message', (msg) => {
    parentPort.postMessage({ type: 'message', msg: msg })
  })

  parentPort.on('message', (msg) => {
    switch (msg.type) {
      case 'connect':
        core.connect()
        break
      case 'pa':
        core.getPa()
        break
      case 'status':
        core.getStatus()
        break
      default:
        core.send(msg)
        break
    }
  })

  core.connect()
}
