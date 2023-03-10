import mongoose, {Mongoose} from 'mongoose'
import { config } from './config'


if (!config.MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )
}

const MONGODB_URI: string = config.MONGODB_URI

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
// @ts-ignore
let cached = global.mongoose

if (!cached) {
  // @ts-ignore
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      // bufferCommands: false,
      // useUnifiedTopology: true,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {

      console.log('mongoose connected')
      return mongoose
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}

export default dbConnect
