import mongoose from 'mongoose'
import { searchArrToStr, makeSearchField } from '@/logger/search'
import mongoosePaginate from 'mongoose-paginate-v2'

const eventlogSchema = new mongoose.Schema(
  {
    source: String,
    level: Number,
    priority: String,
    id: String,
    zones: Array,
    message: String,
    search: String
  },
  {
    timestamps: true
  }
)
eventlogSchema.plugin(mongoosePaginate)

makeSearchField(eventlogSchema, 'search', (docs) => {
  const arr = []
  const { id = '', source = '', zones = [], message = '' } = docs
  arr.push(id)
  arr.push(source)
  arr.push(zones.join(','))
  arr.push(message)
  return searchArrToStr(arr)
})

export default mongoose.model('Eventlog', eventlogSchema)
