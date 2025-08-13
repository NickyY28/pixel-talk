// import mongoose from "mongoose";
 
// const MONGODB_URI = process.env.MONGODB_URI!;
// if(!MONGODB_URI){
//     throw new Error("please define the MONGODB_URI environment variable inside .env.local");
// }

// let cached = global.mongoose;

// export async function connectToDatabase() {
//     if (cached.conn) {
//         return cached.conn;
//     }
//     if(!cached.promise){
//         const opts = {
//             bufferCommands: true,
//             maxPoolSize: 10, // Adjust as needed
//         }
//         cached.promise = mongoose
//         .connect(MONGODB_URI, opts)
//         .then(()=> mongoose.connection);
//     }
//     try {
//         cached.conn = await cached.promise;
//     } catch (error) {
//         cached.promise = null;
//         throw error;
//     }
//     return cached.conn;
// }

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      maxPoolSize: 10,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then(() => mongoose.connection);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}