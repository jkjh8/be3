import mongoose from 'mongoose'

export default mongoose.model(
  'Schedules',
  new mongoose.Schema(
    {
      index: Number,
      name: String,
      repeat: String,
      dateTime: String,
      date: String,
      time: String,
      zones: Array,
      message: String,
      description: String,
      user: String
    },
    { timestamps: true }
  )
)
