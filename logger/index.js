import Log from '@/db/models/eventlog'
import clc from 'cli-color'
import moment from 'moment'

const levels = {
  0: 'info',
  1: 'warn',
  2: 'error',
  3: 'admin_info',
  4: 'admin_warn',
  5: 'admin_error'
}

function cliLog(logs) {
  if (process.env.NODE_ENV !== 'production') {
    switch (logs.level) {
      case 2:
      case 5:
        console.error(
          clc.red(
            `${logs.priority.toUpperCase()} ${moment().format(
              'YYYY-MM-DD hh:mm:ss a'
            )} ${logs.message}`
          )
        )
        break
      case 1:
      case 4:
        console.log(
          clc.yellow(
            `${logs.priority.toUpperCase()} ${moment().format(
              'YYYY-MM-DD hh:mm:ss a'
            )} ${logs.message}`
          )
        )
        break
      default:
        console.log(
          clc.green(
            `${logs.priority.toUpperCase()} ${moment().format(
              'YYYY-MM-DD hh:mm:ss a'
            )} ${logs.message}`
          )
        )
        break
    }
  }
}

export const loggerArr = async (level, user, msg) => {
  try {
    let id = user ?? ''
    if (typeof user === 'object') {
      id = user.email
    }

    const log = new Log({
      priority: levels[level],
      level,
      id,
      message: msg
    })
    await log.save()
    cliLog(log)
  } catch (err) {
    throw err
  }
}

export const logger = async (msg) => {
  try {
    msg.priority = levels[msg.level]
    const log = new Log(msg)
    await log.save()
    cliLog(msg)
  } catch (err) {
    throw err
  }
}
