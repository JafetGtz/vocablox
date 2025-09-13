// src/services/supabase.ts
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import Config from 'react-native-config'
import type { Database } from '@/types/database'

const SUPABASE_URL = Config.SUPABASE_URL!
const SUPABASE_ANON_KEY = Config.SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
)
