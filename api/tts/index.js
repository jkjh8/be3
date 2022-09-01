import { PythonShell } from 'python-shell'
import { v4 as uuidv4 } from 'uuid'
import path from 'node:path'
import { loggerArr as log } from '@/logger'

export async function getTtsInfo() {
  return new Promise((resolve, reject) => {
    const options = {
      mode: 'json',
      pythonPath: 'python3',
      pythonOptions: ['-u'],
      scriptPath: __dirname,
      args: ['get_info']
    }

    PythonShell.run('tts.py', options, (err, result) => {
      if (err) {
        log(5, 'Server', `TTS 정보를 가져올 수 없습니다. ${err}`)
        reject(err)
      }
      resolve(result[0])
    })
  })
}

export async function preview(args) {
  return new Promise((resolve, reject) => {
    const { voice, rate, message } = args
    const filename = path.join(tnmpPath, `${uuidv4()}.mp3`)

    PythonShell.run(
      'tts.py',
      {
        mode: 'json',
        pythonPath: 'python3',
        pythonOptions: ['-u'],
        scriptPath: __dirname,
        args: ['make_file', message, filename, rate, voice.id]
      },
      (err, result) => {
        if (err) {
          log(5, 'Server', `TTS 합성오류 ${err}`)
          reject(err)
        }
        resolve({ ...result[0], base: 'tmp' })
      }
    )
  })
}

export async function makeFile(args) {
  return new Promise((resolve, reject) => {
    const { name, voice, rate, message, folder } = args
    let filename
    if (name && name !== 'undefined') {
      filename = path.join(filesPath, 'TTS', `${name}.mp3`)
    } else {
      filename = path.join(filesPath, 'TTS', `${uuidv4()}.mp3`)
    }

    PythonShell.run(
      'tts.py',
      {
        mode: 'json',
        pythonPath: 'python3',
        pythonOptions: ['-u'],
        scriptPath: __dirname,
        args: ['make_file', message, filename, rate, voice.id]
      },
      (err, result) => {
        if (err) {
          log(5, 'Server', `TTS 합성오류 ${err}`)
          reject(err)
        }
        resolve({ ...result[0], base: 'TTS' })
      }
    )
  })
}
