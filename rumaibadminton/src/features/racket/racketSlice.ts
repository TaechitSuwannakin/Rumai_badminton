// features/racket/racketSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabaseClient';

// --- 1) Define Core Data Types ---
export interface Racket {
  flex: ReactNode;
  id: number;
  brand: string;
  model_name: string;
  // ปรับให้ตรงกับ DB จริงของคุณ
  style_tag: 'All-round' | 'Fast attack' | 'Power smash' | 'Control / Defense';
  balance_tag: 'Head-light' | 'Even balance' | 'Head-heavy';
  player_level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: number;
  description: string | null;
  image_path: string | null;
  image_url?: string | null; // URL ที่ gen แล้ว
  match_percentage?: number; // คะแนนความแมตช์
}

// --- 2) Define State Type ---
export interface RacketState {
  playstyle: string; // ใช้ string เพื่อความยืดหยุ่น หรือใช้ Type เดิมก็ได้
  balance: string;
  level: string;
  budget: string;
  recommendedRackets: Racket[];
  isLoading: boolean;
  error: string | null;
}

const initialState: RacketState = {
  playstyle: 'All-round',
  balance: 'Even balance',
  level: 'Beginner (เพิ่งเริ่มเล่น)',
  budget: '1,500 – 3,000',
  recommendedRackets: [],
  isLoading: false,
  error: null,
};

// --- Helper: image_path -> public URL ---
const toPublicImageUrl = (image_path: string | null) => {
  if (!image_path) return null;
  // *อย่าลืมเช็คชื่อ Bucket ให้ตรงกับใน Supabase (ในโค้ดเก่าคุณใช้ 'rackets')*
  return supabase.storage.from('rackets').getPublicUrl(image_path).data.publicUrl;
};

// --- 3) Helper: Calculate Score ---
const calculateMatchPercentage = (r: Racket, f: RacketState) => {
  let score = 0;
  const maxScore = 100;

  // 1. Style (สำคัญสุด 40%)
  // ถ้าเลือก All-round และไม้เป็น All-round หรือถ้าเลือกตรงเป๊ะๆ
  if (r.style_tag === f.playstyle) score += 40;

  // 2. Balance (25%)
  // ถ้า User เลือก Any หรือ ตรงกัน
  if (f.balance === 'Any' || r.balance_tag === f.balance) score += 25;
  // *แถมคะแนนช่วย* ถ้าเลือก All-round แต่มันเป็น Even balance (ซึ่งคล้ายกัน)
  else if (f.playstyle === 'All-round' && r.balance_tag === 'Even balance') score += 15;

  // 3. Level (15%)
  // เช็คว่า string ของ level user มีคำที่ตรงกับ level ไม้ไหม
  if (r.player_level && f.level.includes(r.player_level)) score += 15;

  // 4. Budget (20%)
  if (f.budget) {
    // ลบลูกน้ำออกก่อน: "1,500" -> "1500"
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

  return Math.min(score, maxScore); // ห้ามเกิน 100
};

// --- 4) Async Thunk ---
export const fetchRecommendedRackets = createAsyncThunk<
  Racket[],
  void, // ไม่ต้องรับ arg เพราะเราอ่านจาก State ได้เลย (หรือจะรับแบบเดิมก็ได้)
  { state: { racket: RacketState }; rejectValue: string }
>('racket/fetchRecommendedRackets', async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState().racket;
    
    // เริ่มต้นดึงข้อมูล
    let query = supabase.from('rackets').select('*');

    // ** Logic การ Query ** // ถ้าเราอยากดึงมาหมดแล้วมาคำนวณ Score ข้างนอก (เพื่อให้เห็นไม้ใกล้เคียงด้วย)
    // แนะนำให้ดึงมาเยอะหน่อย แล้วค่อยมา sort ด้วย match_percentage
    
    // แต่ถ้าอยากกรองเลย:
    // if (state.playstyle) query = query.eq('style_tag', state.playstyle);

    // *แนะนำ:* ดึงมาทั้งหมดที่ Active หรือ limit 50 ตัว เพื่อมาคำนวณ % ให้ลูกค้าเห็นว่าไม้อื่นก็อาจจะเหมาะนะ
    const { data, error } = await query.limit(50);

    if (error) throw error;

    const rawData = data as Racket[];

    // แปลงข้อมูล + คำนวณ Score
    const processedData = rawData.map((r) => ({
      ...r,
      image_url: toPublicImageUrl(r.image_path), // แปลง path เป็น url
      match_percentage: calculateMatchPercentage(r, state),
    }));

    // เรียงลำดับตามความเหมาะสม (มากไปน้อย)
    processedData.sort((a, b) => (b.match_percentage || 0) - (a.match_percentage || 0));

    return processedData;

  } catch (error: any) {
    return rejectWithValue(error.message || 'Error fetching rackets');
  }
});

// --- 5) Slice ---
export const racketSlice = createSlice({
  name: 'racket',
  initialState,
  reducers: {
    setPlaystyle: (state, action: PayloadAction<string>) => { state.playstyle = action.payload; },
    setBalance: (state, action: PayloadAction<string>) => { state.balance = action.payload; },
    setLevel: (state, action: PayloadAction<string>) => { state.level = action.payload; },
    setBudget: (state, action: PayloadAction<string>) => { state.budget = action.payload; },
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