import { supabaseClient } from '../lib/supabase_client.js'

export const fetchHeadingText = async () =>
{
    const { data, error } = await supabaseClient
        .from('heading')
        .select('*')

    if(error)
    {
        console.error('Error fetching heading text: ', error)
    }
    
    return data ?? []
}