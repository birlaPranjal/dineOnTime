import { MongoClient, type Db, type Document } from "mongodb"
import dotenv from "dotenv"

dotenv.config()

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to environment variables")
}

const uri = process.env.MONGODB_URI ?? ""
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

// For Vercel serverless, reuse connections across invocations
// In development, use global to prevent multiple connections during hot reload
if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // Production/serverless: reuse connection if it exists, otherwise create new
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
}

export default clientPromise

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise
  return client.db("dineontime")
}

export async function getCollection<T extends Document = Document>(collectionName: string) {
  const db = await getDatabase()
  return db.collection<T>(collectionName)
}

