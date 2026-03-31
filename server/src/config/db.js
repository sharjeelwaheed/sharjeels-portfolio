const mongoose = require('mongoose')

let cached = global.mongoose || { conn: null, promise: null }
global.mongoose = cached

const connectDB = async () => {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false,
    }).then((m) => m)
  }

  try {
    cached.conn = await cached.promise
  } catch (error) {
    cached.promise = null
    console.error(`❌ MongoDB connection error: ${error.message}`)
    throw error
  }

  return cached.conn
}

module.exports = connectDB
