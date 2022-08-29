import net from 'net'
import { EventEmitter } from 'events'
import { emit } from 'process'

export class QRC extends EventEmitter {
  constructor(ipaddress) {
    super()
    this.client = net.Socket()
    this._ipaddrerss = ipaddress
    this.connected = false
    this._data = Buffer.alloc(0)
    this._noOpInterval = null
    this._command = []
    this._commandInterval = null

    this.client.on('connect', () => {
      this.connected = true
      this.noOp()
      this.emit('connect'), `Q-Sys connected ipaddress: ${this._ipaddress}`
    })

    this.client.on('close', () => {
      this.connected = false
      clearInterval(this._noOpInterval)
      this._noOpInterval = null
      this.emit('close'), `Q-Sys closed ipaddress: ${this._ipaddress}`
    })

    this.client.on('timeout', () => {
      this.client.end()
      this.emit('error', new Error('timeout'))
    })

    this.client.on('error', (err) => {
      this.connected = false
      clearInterval(this._noOpInterval)
      this._noOpInterval = null
      this.emit('error', err)
    })

    this.client.on('data', (data) => {
      if (data.includes(0)) {
        const result = Buffer.concat(this._data, data.slice(0, data.indexOf(0)))
        const remaind = data.slice(data.indexOf(0) + 1, data.length)
        if (remaind.length) {
          this._data = remaind
        } else {
          this._data = Buffer.alloc(0)
        }
        // result
        try {
          this.emit('message', JSON.parse(result))
        } catch (err) {
          console.error(err)
        }
      } else {
        this._data = Buffer.concat(this._data, data)
      }
    })
  }
  // end constructor

  connect() {
    if (this.connected === false) {
      this.client.connect({ port: 1710, host: this._ipaddress })
    } else {
      this.emit('message', {
        type: 'info',
        message: 'Socket already connected'
      })
    }
  }

  send(msg) {
    if (this._noOpInterval) {
      clearInterval(this._noOpInterval)
      this._noOpInterval = null
    }
    this._command.push(msg)
    if (!this._commandInterval) {
      this.queueProcess()
      this._commandInterval = setInterval(() => {
        this.queueProcess()
      }, 500)
    }
  }

  queueProcess() {
    if (this._command.length) {
      if (this.connected) {
        const msg = this._command.shift()
        this.client.write(JSON.stringify({ jsonrpc: '2.0', ...msg }) + '\0')
      }
    } else {
      clearInterval(this._commandInterval)
      this._commandInterval = null
      this.noOp()
    }
  }

  noOp() {
    this._noOpInterval = setInterval(() => {
      this.getStatus()
    }, 50000)
  }

  getStatus() {
    this.send({ id: 'GetStatus', method: 'StatusGet', params: 0 })
  }

  getPa() {
    this.send({
      id: 'GetPa',
      method: 'Component.GetControls',
      params: { Name: 'PA' }
    })
  }
}
