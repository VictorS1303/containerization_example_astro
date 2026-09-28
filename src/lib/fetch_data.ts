import { postgresClient } from './postgres_client'

// CREATING WRAPPER FUNCTION
export const fetchHeadingText = async () =>
{
    // FETCHING EVERYTHING FROM THE "heading" TABLE
    const result = await postgresClient.query(
        "SELECT * FROM heading"
    ) 

    // RETURNING THE ROWS
    return result.rows
}