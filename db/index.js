import mongoose from 'mongoose'
import { loggerArr as log } from '@/logger'

mongoose
  .connect('mongodb://localhost:27017/bs')
  .then(() => {
    log(3, 'server', 'Mongodb Connected')
  })
  .catch((e) => {
    console.error(`Mongodb Connect error ${e}`)
  })

export default mongoose.connection
