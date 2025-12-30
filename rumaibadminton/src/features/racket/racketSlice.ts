import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabaseClient';

//กำหนดข้อมูลของไม้แบด
export interface Racket {
  id: number;
  brand: string;
  model_name: string;
  style_tag: string;
  balance_tag: 'Head-light' | 'Even balance' | 'Head-heavy';
  player_level: 'Beginner' | 'Intermediate';
  price: number;
  flex?: string;
  description: string | null;
  image_path: string | null;
  image_url?: string | null;
}

// กำหนดข้อมูลของทั้งหน้าจอ
export interface RacketState {
  playstyle: string | null;
  balance: string | null;
  level: string | null;
  budget: string | null;
  recommendedRackets: Racket[]; // ผลลัพธ์ไม้แนะนำ เก็บเป็นอาเรย์ สถานะเริ่มต้นเป็นค่าว่าง
  isLoading: boolean;
  error: string | null;
}

//กำหนดค่า State เริ่มต้น
const initialState: RacketState = {
  playstyle: null,
  balance: null,
  level: null,
  budget: null,
  recommendedRackets: [],
  isLoading: false,
  error: null,
};

// =========================================================
const toPublicImageUrl = (image_path: string | null) => {
  if (!image_path) return null;
  return supabase.storage.from('rackets').getPublicUrl(image_path).data.publicUrl;
};

// =========================================================
//Async Thunk: หการดึงข้อมูล (Fetch Logic)
// =========================================================

// ฟังก์ชันนี้จะ เช็คข้อมูล -> ค้นหา DB -> กรองเงื่อนไข -> ส่งผลลัพธ์กลับ
export const fetchRecommendedRackets = createAsyncThunk<
  Racket[], // สิ่งที่ Return ออกไป (Array ของไม้แบด)
  void,
  { state: { racket: RacketState }; rejectValue: string }
>('racket/fetchRecommendedRackets', async (_, { getState, rejectWithValue }) => {
  try {
    // ดึง State ปัจจุบันมาดูว่า User เลือกอะไรไปบ้าง
    const state = getState().racket;

    if (
      !state.playstyle || state.playstyle === 'null' ||
      !state.balance || state.balance === 'null' ||
      !state.level || state.level === 'null' ||
      !state.budget || state.budget === 'null'
    ) {
      return [];
    }

    // เริ่มต้น Query เลือกทุกคอลัมน์จากตาราง rackets
    let query = supabase.from('rackets').select('*');

    if (state.playstyle) {
      query = query.ilike('style_tag', `%${state.playstyle}%`);
    }
    if (state.balance) {
      query = query.eq('balance_tag', state.balance);
    }
    if (state.level) {
      if (state.level.includes('Beginner')) {
        query = query.eq('player_level', 'Beginner');
      } else if (state.level.includes('Intermediate')) {
        query = query.eq('player_level', 'Intermediate');
      }
    }

    //แปลงข้อความ "2,000 - 4,000" ให้เป็นตัวเลข
    if (state.budget) {
      //ลบลูกน้ำออกก่อน ด้วย replace
      const cleanBudget = state.budget.replace(/,/g, '');
      //ดึงเฉพาะตัวเลขออกมาเก็บใน Array ([2000, 4000]) ส่วน  /\d+/g: รหัส Regex ต้องใส่ g ไว้สุดท้ายด้วย
      const nums = cleanBudget.match(/\d+/g)?.map(Number);

      if (nums && nums.length > 0) {
        if (state.budget.includes('ต่ำกว่า')) {
          query = query.lte('price', nums[0]);
        } else if (state.budget.includes('ขึ้นไป')) {
          query = query.gte('price', nums[0]);
        } else if (nums.length >= 2) {
          query = query.gte('price', nums[0]).lte('price', nums[1]);
        }
      }
    }

    // ยิงคำสั่งไปที่ Database (จำกัดผลลัพธ์ไม่เกิน 50 ตัว)
    const { data, error } = await query.limit(50);

    if (error) throw error; // ถ้ามี error ให้โยนไปเข้า catch

    const rawData = data as Racket[];

    // แปลงข้อมูล: เอาชื่อไฟล์ไปสร้างเป็น URL รูปภาพเต็มๆ
    const processedData = rawData.map((r) => ({
      ...r,
      image_url: toPublicImageUrl(r.image_path),
    }));

    return processedData; // ส่งผลลัพธ์กลับไปให้ Redux

  } catch (error: any) {
    // ถ้าพัง ให้ส่ง Error message กลับไป
    return rejectWithValue(error.message || 'Error fetching rackets');
  }
});

// =========================================================
// Slice Reducers: ตัวจัดการ State
// =========================================================
export const racketSlice = createSlice({
  name: 'racket',
  initialState,

  // reducers: ฟังก์ชันสำหรับเปลี่ยนค่า State ธรรมดา (ตอนกดเลือก Dropdown)
  reducers: {
    setPlaystyle: (state, action: PayloadAction<string | null>) => { state.playstyle = action.payload; },
    setBalance: (state, action: PayloadAction<string | null>) => { state.balance = action.payload; },
    setLevel: (state, action: PayloadAction<string | null>) => { state.level = action.payload; },
    setBudget: (state, action: PayloadAction<string | null>) => { state.budget = action.payload; },
  },

  // extraReducers: ฟังก์ชันสำหรับจัดการผลลัพธ์จาก Async Thunk (API)
  extraReducers: (builder) => {
    builder
      // 1. กำลังโหลด (Pending) -> ขึ้นหมุนๆ
      .addCase(fetchRecommendedRackets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // 2. โหลดเสร็จแล้ว (Fulfilled) -> เก็บข้อมูลลง State
      .addCase(fetchRecommendedRackets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recommendedRackets = action.payload;
      })
      // 3. โหลดล้มเหลว (Rejected) -> เก็บ Error ไว้โชว์
      .addCase(fetchRecommendedRackets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Export Action ให้ Component อื่นเอาไปใช้ (dispatch)
export const { setPlaystyle, setBalance, setLevel, setBudget } = racketSlice.actions;

export default racketSlice.reducer;