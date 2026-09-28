// Using Pool to manage the database connections
import { Pool } from 'pg'

export const postgresClient = new Pool
(
    {
        host: import.meta.env.POSTGRES_HOST,
        port: Number(import.meta.env.POSTGRES_PORT),
        database: import.meta.env.POSTGRES_DATABASE,
        user: import.meta.env.POSTGRES_USER,
        password: import.meta.env.POSTGRES_PASSWORD
    }
)

console.log(import.meta.env.POSTGRES_PASSWORD)