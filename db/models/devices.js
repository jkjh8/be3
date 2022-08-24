import mongoose from 'mongoose'

export default mongoose.model(
  'Devices',
  new mongoose.Schema(
    {
      index: Number,
      name: String,
      ipaddress: String,
      port: { type: Number, default: 4444 },
      deviceType: String,
      model: String,
      mode: String,
      channels: Number,
      channel: Number,
      status: Boolean
    },
    { timestamps: true }
  )
)
