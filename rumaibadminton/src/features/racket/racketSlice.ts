import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabaseClient';


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
  image_path: string | null; // ชื่อไฟล์ใน Storage (เช่น "yonex/ax88d.png")

  // Fields ที่ Frontend คำนวณเพิ่มเอง
  image_url?: string | null; // ลิงก์รูปเต็มๆ ที่เปิดดูได้จริง
  match_percentage?: number; // เปอร์เซ็นต์ความแมตช์ (เผื่อใช้ในอนาคต)
}

// RacketState: หน้าตาของ State ทั้งหมดในหน้านี้
export interface RacketState {
  // ข้อมูลที่ User เลือกจาก Dropdown (เก็บค่าที่เลือกไว้)
  playstyle: string | null;
  balance: string | null;
  level: string | null;
  budget: string | null;

  // ผลลัพธ์ที่ได้จากการค้นหา
  recommendedRackets: Racket[];

  // สถานะการโหลด (Loading / Error)
  isLoading: boolean;
  error: string | null;
}

// =========================================================
// 2) กำหนดค่าเริ่มต้น (Initial State)
// =========================================================
const initialState: RacketState = {
  // เริ่มต้นเป็น null คือยังไม่ได้เลือกอะไรเลย
  playstyle: null,
  balance: null,
  level: null,
  budget: null,
  recommendedRackets: [],
  isLoading: false,
  error: null,
};

// =========================================================
// 3) Helper Function: แปลงชื่อไฟล์เป็น URL จริง
// =========================================================
const toPublicImageUrl = (image_path: string | null) => {
  if (!image_path) return null;
  // ดึง Public URL จาก Supabase Storage ใน Bucket ชื่อ 'rackets'
  return supabase.storage.from('rackets').getPublicUrl(image_path).data.publicUrl;
};

// =========================================================
// 4) Async Thunk: หัวใจหลักของการดึงข้อมูล (Fetch Logic)
// =========================================================
// ฟังก์ชันนี้จะทำหน้าที่: เช็คข้อมูล -> ค้นหา DB -> กรองเงื่อนไข -> ส่งผลลัพธ์กลับ
export const fetchRecommendedRackets = createAsyncThunk<
  Racket[], // สิ่งที่ Return ออกไป (Array ของไม้แบด)
  void,
  { state: { racket: RacketState }; rejectValue: string }
>('racket/fetchRecommendedRackets', async (_, { getState, rejectWithValue }) => {
  try {
    // ดึง State ปัจจุบันมาดูว่า User เลือกอะไรไปบ้าง
    const state = getState().racket;

    // ถ้ามีช่องไหนเป็นค่าว่าง หรือ 'null' ให้หยุดทำงานทันที ไม่ต้องยิง Database
    if (
      !state.playstyle || state.playstyle === 'null' ||
      !state.balance || state.balance === 'null' ||
      !state.level || state.level === 'null' ||
      !state.budget || state.budget === 'null'
    ) {
      // คืนค่า Array ว่างเปล่ากลับไป (หน้าจอจะไม่แสดงผลลัพธ์)
      return [];
    }

    // --- ถ้าเลือกครบแล้ว ถึงจะเริ่มสร้างคำสั่งค้นหา ---

    // เริ่มต้น Query เลือกทุกคอลัมน์จากตาราง rackets
    let query = supabase.from('rackets').select('*');

    // ---------------------------------------------------------
    // Step 1: กรองตามสไตล์การเล่น (Playstyle)
    // ---------------------------------------------------------

    if (state.playstyle) {
      query = query.ilike('style_tag', `%${state.playstyle}%`);
    }

    if (state.balance) {
      query = query.eq('balance_tag', state.balance);
    }

    // ---------------------------------------------------------
    // 🎓 Step 3: กรองตามระดับฝีมือ (Level)
    // ---------------------------------------------------------
    // เช็คว่า User เลือก Beginner หรือ Intermediate แล้วกรองตามนั้น
    if (state.level) {
      if (state.level.includes('Beginner')) {
        query = query.eq('player_level', 'Beginner');
      } else if (state.level.includes('Intermediate')) {
        query = query.eq('player_level', 'Intermediate');
      }
    }

    // ---------------------------------------------------------
    // Step 4: กรองตามงบประมาณ (Budget)
    // ---------------------------------------------------------
    // ส่วนนี้ซับซ้อนหน่อย เพราะต้องแปลงข้อความ "2,000 - 4,000" ให้เป็นตัวเลข
    if (state.budget) {
      // 1. ลบลูกน้ำออก (เช่น "2,000" -> "2000")
      const cleanBudget = state.budget.replace(/,/g, '');
      // 2. ดึงเฉพาะตัวเลขออกมาเก็บใน Array ([2000, 4000])
      const nums = cleanBudget.match(/\d+/g)?.map(Number);

      if (nums && nums.length > 0) {
        if (state.budget.includes('ต่ำกว่า')) {
          // กรณี: "ต่ำกว่า 2,000" -> ราคา <= 2000
          query = query.lte('price', nums[0]);
        } else if (state.budget.includes('ขึ้นไป')) {
          // กรณี: "4,000 ขึ้นไป" -> ราคา >= 4000
          query = query.gte('price', nums[0]);
        } else if (nums.length >= 2) {
          // กรณี: ช่วงราคา "2,000 - 4,000" -> ราคาอยู่ระหว่างนี้
          query = query.gte('price', nums[0]).lte('price', nums[1]);
        }
      }
    }

    // -----------------------------------------------------
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
// 5) Slice Reducers: ตัวจัดการ State
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