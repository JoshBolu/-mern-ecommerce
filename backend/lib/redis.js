import dotenv from "dotenv"
dotenv.config()

import Redis from "ioredis"

// export const redis = new Redis("rediss://default:Abb0AAIjcDFjYmI0N2MyMjMxMTk0NjUzOTgzY2FmNWZlOTFjNDNkN3AxMA@cosmic-lobster-46836.upstash.io:6379")
export const redis = new Redis(process.env.UPSTASH_REDIS_URL)