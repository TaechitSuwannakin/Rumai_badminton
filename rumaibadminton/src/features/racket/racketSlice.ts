import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabaseClient';

// --- 1) Define Core Data Types ---
export interface Racket {
  id: number;
  brand: string;
  model_name: string;
  style_tag: 'All-round' | 'Fast attack' | 'Power smash' | 'Control / Defense';
  balance_tag: 'Head-light' | 'Even balance' | 'Head-heavy';
  player_level: 'Beginner' | 'Intermediate';
  price: number;
  flex?: string; // เพิ่ม flex เผื่อไว้
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

const initialState: RacketState = {
  playstyle: 'null',
  balance: 'null',
  level: 'null',
  budget: 'null',
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

// --- Helper: Calculate Match Score (คำนวณคะแนนความเหมาะสม) ---
const calculateMatchPercentage = (r: Racket, f: RacketState) => {
  let score = 0;
  const maxScore = 100;

  // 1. Style (40%)
  if (r.style_tag === f.playstyle) score += 40;

  // 2. Balance (25%)
  if (f.balance === 'Any' || r.balance_tag === f.balance) score += 25;
  else if (f.playstyle === 'All-round' && r.balance_tag === 'Even balance') score += 15; // คะแนนช่วย

  // 3. Level (15%)
  // เช็คว่า level ใน UI (ยาวๆ) มีคำที่ตรงกับ DB (สั้นๆ) หรือไม่
  if (r.player_level && f.level.includes(r.player_level)) score += 15;

  // 4. Budget Score (20%) - ให้คะแนนถ้าราคาอยู่ในงบ
  if (f.budget) {
    const cleanBudget = f.budget.replace(/,/g, '');
    const nums = cleanBudget.match(/\d+/g)?.map(Number);
    
    if (nums) {
        if (f.budget.includes('ต่ำกว่า') && nums[0]) {
            if (r.price <= nums[0]) score += 20;
        } else if (f.budget.includes('ขึ้นไป') && nums[0]) {
            if (r.price >= nums[0]) score += 20;
        } else if (nums.length >= 2) {
            const [min, max] = nums;
            if (r.price >= min && r.price <= max) score += 20;
        }
    }
  }

  return Math.min(score, maxScore);
};

// --- 4) Async Thunk: Fetch & Filter ---
export const fetchRecommendedRackets = createAsyncThunk<
  Racket[],
  void,
  { state: { racket: RacketState }; rejectValue: string }
>('racket/fetchRecommendedRackets', async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState().racket;
    
    // เริ่มสร้าง Query
    let query = supabase.from('rackets').select('*');

    
    // 1. กรอง Style
    // ถ้าเลือก All-round จะไม่กรอง (ดึงมาหมดเพื่อให้เห็นตัวเลือกหลากหลาย)
    if (state.playstyle && state.playstyle !== 'All-round') {
      query = query.ilike('style_tag', state.playstyle);
    }

    // 2. กรอง Balance
    if (state.balance) {
      query = query.eq('balance_tag', state.balance);
    }

    // 3. กรอง Level (แปลงข้อความยาวๆ เป็นคำสั้นๆ เพื่อหาใน DB)
    if (state.level) {
      if (state.level.includes('Beginner')) {
        query = query.eq('player_level', 'Beginner');
      } else if (state.level.includes('Intermediate')) {
        query = query.eq('player_level', 'Intermediate');
      }
    }

    // 4. กรอง Budget (แกะตัวเลขจาก string มาเทียบราคา)
    if (state.budget) {
       const cleanBudget = state.budget.replace(/,/g, ''); // ลบลูกน้ำออก
       const nums = cleanBudget.match(/\d+/g)?.map(Number); // หาตัวเลขทั้งหมด

       if (nums && nums.length > 0) {
          if (state.budget.includes('ต่ำกว่า')) {
             // กรณี: "ต่ำกว่า 1,500"
             query = query.lte('price', nums[0]);
          } else if (state.budget.includes('ขึ้นไป')) {
             // กรณี: "3,000 ขึ้นไป"
             query = query.gte('price', nums[0]);
          } else if (nums.length >= 2) {
             // กรณี: "1,500 - 3,000"
             query = query.gte('price', nums[0]).lte('price', nums[1]);
          }
       }
    }

    // -----------------------------------------------------

    // จำกัดจำนวนผลลัพธ์ที่ 50 ตัว
    const { data, error } = await query.limit(50);

    if (error) throw error;

    const rawData = data as Racket[];

    // แปลงข้อมูล URL และคำนวณ % ความแมตช์
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