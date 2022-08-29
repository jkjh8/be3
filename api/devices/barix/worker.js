import { workerData, parentPort } from 'worker_threads'
import * as cheerio from 'cheerio'
import axios from 'axios'

async function getHtml(ipaddress) {
  try {
    const html = await axios.get(`http://${ipaddress}/status`, {
      timeout: 5000
    })
    let rtData = {}
    const $ = cheerio.load(html.data)
    $('dd').each((i, elm) => {
      rtData[$(elm).find('span:nth-of-type(2)').attr('class')] = $(elm)
        .find('span:nth-of-type(2)')
        .text()
        .trim()
    })
    parentPort.postMessage({ type: 'message', data: rtData })
  } catch (err) {
    parentPort.postMessage({ type: 'error', data: err })
  }
}

if (workerData) {
  getHtml(workerData.ipaddress)
}
