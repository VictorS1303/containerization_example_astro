// Using Pool to manage the database connections
import { Pool } from 'pg'

export const postgresClient = new Pool
(
    {
        host: process.env.POSTGRES_HOST,
        port: Number(process.env.POSTGRES_PORT),
        database: process.env.POSTGRES_DATABASE,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD
    }
)