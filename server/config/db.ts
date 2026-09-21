import mongoose from 'mongoose';
import net from 'net';

let isConnected = false;

function isLocalPortReachable(host: string, port: number, timeoutMs = 250): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port });
    socket.setTimeout(timeoutMs);
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.once('error', () => {
      socket.destroy();
      resolve(false);
    });
  });
}

export async function connectDB(): Promise<boolean> {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri || mongoUri.includes('username:password')) {
    console.log('[Database] MONGODB_URI not configured or placeholder detected. Operating with active in-memory catalog & order store.');
    return false;
  }

  // If pointing to localhost/127.0.0.1, verify that MongoDB is actively running before attempting Mongoose connect
  const isLocalHost = mongoUri.includes('localhost') || mongoUri.includes('127.0.0.1');
  if (isLocalHost) {
    const isReachable = await isLocalPortReachable('127.0.0.1', 27017, 200);
    if (!isReachable) {
      console.log('[Database] Local MongoDB server not running on 127.0.0.1:27017. Operating with active catalog & order repository.');
      return false;
    }
  }

  try {
    if (isConnected) {
      return true;
    }

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });

    isConnected = true;
    console.log(`[Database] MongoDB Atlas Connected: ${conn.connection.host}`);
    return true;
  } catch (_error) {
    console.log('[Database] Remote MongoDB unreachable. Operating with active catalog & order repository.');
    isConnected = false;
    return false;
  }
}

export function isMongoConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}
