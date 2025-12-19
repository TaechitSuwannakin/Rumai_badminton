import { createClient } from '@supabase/supabase-js'

// ✅ ของใหม่ (ใส่ค่าจริงลงไปเลย)
const supabaseUrl = "https://akwllbbtajxuvqfwksie.supabase.co"
const supabaseKey = "sb_publishable_Qid4amSc2MaDVtsh196N4w__EvztSMZ"

export const supabase = createClient(supabaseUrl, supabaseKey)