import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabaseClient';

// --- 1) Define Core Data Types ---
export interface Racket {
  id: number;
  brand: string;
  model_name: string;
  // เป็น string เพื่อรองรับหลาย tag เช่น "Power smash, Speed"
  style_tag: string; 
  balance_tag: 'Head-light' | 'Even balance' | 'Head-heavy';
  player_level: 'Beginner' | 'Intermediate';
  price: number;
  flex?: string;
  description: string | null;
  image_path: string | null;
  
  // Fields ที่สร้างเพิ่มใน Frontend
  image_url?: string | null;
  match_percentage?: number;
}

// --- 2) Define State Type ---
export interface RacketState {
  playstyle: string | null;
  balance: string | null;
  level: string | null;
  budget: string | null;
  
  recommendedRackets: Racket[];
  isLoading: boolean;
  error: string | null;
}

// กำหนดค่าเริ่มต้นเป็น null จริงๆ (ไม่ใช่ string 'null')
const initialState: RacketState = {
  playstyle: null,
  balance: null,
  level: null,
  budget: null,
  recommendedRackets: [],
  isLoading: false,
  error: null,
};

// --- Helper: image_path -> public URL ---
const toPublicImageUrl = (image_path: string | null) => {
  if (!image_path) return null;
  // ⚠️ เช็คชื่อ Bucket ให้ตรงกับใน Supabase ของคุณ (ในที่นี้ใช้ 'rackets')
  return supabase.storage.from('rackets').getPublicUrl(image_path).data.publicUrl;
};

// --- 4) Async Thunk: Fetch & Filter ---
export const fetchRecommendedRackets = createAsyncThunk<
  Racket[],
  void,
  { state: { racket: RacketState }; rejectValue: string }
>('racket/fetchRecommendedRackets', async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState().racket;
    
    // 🛑 GUARD CLAUSE: เช็คว่าเลือกครบทุกช่องหรือยัง?
    // ถ้าช่องไหนยังเป็น null หรือค่าว่าง หรือเป็น string 'null' ให้หยุดทำงานทันที
    if (
      !state.playstyle || state.playstyle === 'null' ||
      !state.balance || state.balance === 'null' ||
      !state.level || state.level === 'null' ||
      !state.budget || state.budget === 'null'
    ) {
      // คืนค่าอาเรย์ว่าง (หน้าจอจะไม่แสดงผลลัพธ์)
      return [];
    }

    // --- ถ้าเลือกครบแล้ว ถึงจะเริ่มค้นหา ---
    
    let query = supabase.from('rackets').select('*');

    // 1. กรอง Style (Playstyle)
    // ใช้ .ilike และ % เพื่อหาคำค้นหาที่ซ่อนอยู่ในข้อความ (เช่น หา 'Speed' ใน 'Power smash, Speed')
    if (state.playstyle) {
      query = query.ilike('style_tag', `%${state.playstyle}%`);
    }

    // 2. กรอง Balance
    // ใช้ .eq เพราะ Balance มักจะมีค่าเดียวและตรงตัว
    if (state.balance) {
      query = query.eq('balance_tag', state.balance);
    }

    // 3. กรอง Level
    // ใช้ .eq เพื่อความแม่นยำ (แต่ถ้าในอนาคตมีหลาย Level ในช่องเดียว ให้เปลี่ยนเป็น .ilike)
    if (state.level) {
      if (state.level.includes('Beginner')) {
        query = query.eq('player_level', 'Beginner');
      } else if (state.level.includes('Intermediate')) {
        query = query.eq('player_level', 'Intermediate');
      }
    }

    // 4. กรอง Budget
    if (state.budget) {
       // ลบลูกน้ำออก (เช่น "2,000" -> "2000")
       const cleanBudget = state.budget.replace(/,/g, ''); 
       // ดึงตัวเลขทั้งหมดออกมาเก็บใน Array
       const nums = cleanBudget.match(/\d+/g)?.map(Number); 

       if (nums && nums.length > 0) {
          if (state.budget.includes('ต่ำกว่า')) {
             // กรณี: "ต่ำกว่า 2,000" -> ราคาต้องน้อยกว่าหรือเท่ากับ 2000
             query = query.lte('price', nums[0]);
          } else if (state.budget.includes('ขึ้นไป')) {
             // กรณี: "4,000 ขึ้นไป" -> ราคาต้องมากกว่าหรือเท่ากับ 4000
             query = query.gte('price', nums[0]);
          } else if (nums.length >= 2) {
             // กรณี: "2,000 - 4,000" -> ราคาต้องอยู่ระหว่างกลาง
             query = query.gte('price', nums[0]).lte('price', nums[1]);
          }
       }
    }

    // -----------------------------------------------------

    // จำกัดจำนวนผลลัพธ์ที่ 50 ตัว
    const { data, error } = await query.limit(50);

    if (error) throw error;

    const rawData = data as Racket[];

    // แปลงข้อมูล URL
    const processedData = rawData.map((r) => ({
      ...r,
      image_url: toPublicImageUrl(r.image_path),
    }));

    return processedData;

  } catch (error: any) {
    return rejectWithValue(error.message || 'Error fetching rackets');
  }
});

// --- 5) Slice Reducers ---
export const racketSlice = createSlice({
  name: 'racket',
  initialState,
  reducers: {
    setPlaystyle: (state, action: PayloadAction<string | null>) => { state.playstyle = action.payload; },
    setBalance: (state, action: PayloadAction<string | null>) => { state.balance = action.payload; },
    setLevel: (state, action: PayloadAction<string | null>) => { state.level = action.payload; },
    setBudget: (state, action: PayloadAction<string | null>) => { state.budget = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommendedRackets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRecommendedRackets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recommendedRackets = action.payload;
      })
      .addCase(fetchRecommendedRackets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setPlaystyle, setBalance, setLevel, setBudget } = racketSlice.actions;
export default racketSlice.reducer;