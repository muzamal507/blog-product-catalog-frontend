import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'Aapka_Supabase_Project_URL'
const supabaseAnonKey = 'Aapka_Supabase_Anon_Public_Key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)