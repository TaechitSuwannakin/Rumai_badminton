import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
//import axios from 'axios';

// --- 1. กำหนดประเภทข้อมูลหลักก่อน---

export interface Racket {
  id: number;
  brand: string;
  model_name: string;
  flex: 'Flexible' | 'Medium' | 'Stiff';
  style_tag: 'All-round' | 'Fast attack' | 'Power smash' | 'Control / Defense';
  balance_tag: 'Head-light' | 'Even balance' | 'Head-heavy';
  player_level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: number;
  description: string;
  image_url: string;
  match_percentage: number; 
}

// --- 2. กำหนดประเภท (โครงสร้าง state ใน Redux)---

export interface RacketState {
  //Input State (ค่าที่ผู้ใช้เลือก)
  playstyle: Racket['style_tag'];
  balance: Racket['balance_tag'] | 'Any'; 
  level: string; 
  budget: string; 
  
  // Result State (ผลลัพธ์/สถานะโหลด)
  recommendedRackets: Racket[];
  isLoading: boolean;
  error: string | null;
}

// --- 3. กำหนดสถานะเริิ่มต้นก่อน ---

const initialState: RacketState = {
  // เป็นค่าเริ่มต้นของ store เช่น
  playstyle: 'All-round',
  balance: 'Even balance',
  level: 'Beginner (เพิ่งเริ่มเล่น)', 
  budget: '1,500 – 3,000',
  
  recommendedRackets: [], //(ยังไม่มีไม้แนะนำจนกว่าจะ set)
  isLoading: false,
  error: null,
};

// --- 4. ข้อมูลจำลองสำหรับตัวอย่าง ---

const MOCK_RACKETS: Racket[] = [
  // ****ข้อมูลจำลองแทน API จริง (ไว้ใช้ทดสอบระบบแนะนำ/หน้า UI ก่อนทำ backend )***
  {
    id: 1,
    brand: 'YONEX',
    model_name: 'nanoflare 700 pro',
    flex: 'Medium',
    style_tag: 'All-round',
    balance_tag: 'Head-light',
    player_level: 'Intermediate',
    price: 6500,
    description: 'Head-Light · Medium Stiff · เหมาะกับสาย all-round / Control + speed',
    image_url: 'image_392bec.png', // Assuming this is locally accessible
    match_percentage: 88,
  },
  {
    id: 2,
    brand: 'YONEX',
    model_name: 'nanoflare 700 pro',
    flex: 'Medium',
    style_tag: 'All-round',
    balance_tag: 'Head-light',
    player_level: 'Intermediate',
    price: 6500,
    description: 'Head-Light · Medium Stiff · เหมาะกับสาย all-round / Control + speed',
    image_url: 'image_392bec.png', // Assuming this is locally accessible
    match_percentage: 88,
  },
];

// --- 5. Async Thunk for Fetching Data ---
//อันนี้คือ action แบบ async ที่มี 3 สถานะอัตโนมัติ:pending, fulfilled, rejected
// หมายเหตุ: ในแอปพลิเคชันจริง ตัวกรองจะถูกแยกโครงสร้างและแปลงเป็นค่าที่ใช้งานได้กับ API
export const fetchRecommendedRackets = createAsyncThunk<
  Racket[], // ประเภทการส่งคืนเมื่อดำเนินการเสร็จสิ้น
  Omit<RacketState, 'recommendedRackets' | 'isLoading' | 'error'>, // ประเภทของอาร์กิวเมนต์ (ตัวกรอง)
  { rejectValue: string } // ประเภทของค่าที่ถูกปฏิเสธ
>(
  'racket/fetchRecommendedRackets',
  async (filters, { rejectWithValue }) => {
    // --- Simulate API Call and Filtering Logic ---
    try {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
        
        const filteredRackets = MOCK_RACKETS.filter(racket => {
            // Simplified matching logic for demonstration
            let isMatch = true;

            if (filters.playstyle !== 'All-round' && racket.style_tag !== filters.playstyle) {
                isMatch = false;
            }
            if (filters.balance !== 'Any' && racket.balance_tag !== filters.balance) {
                isMatch = false;
            }
            // Real logic should handle level and budget parsing
            return isMatch;
        });

        return filteredRackets.length > 0 ? filteredRackets : MOCK_RACKETS; 
        
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // In a real app: return rejectWithValue(err.response.data.message);
      return rejectWithValue('การดึงข้อมูลไม้แบดล้มเหลว กรุณาลองใหม่');
    }
  }
);


// --- 6. Create Slice ---

export const racketSlice = createSlice({
  name: 'racket',
  initialState,
  reducers: {
    setPlaystyle: (state, action: PayloadAction<Racket['style_tag']>) => {
      state.playstyle = action.payload;
    },
    setBalance: (state, action: PayloadAction<Racket['balance_tag']>) => {
      state.balance = action.payload;
    },
    setLevel: (state, action: PayloadAction<string>) => {
      state.level = action.payload;
    },
    setBudget: (state, action: PayloadAction<string>) => {
      state.budget = action.payload;
    },
    // Action to populate initial mock data (for testing display before form submit)
    setInitialRackets: (state) => {
        state.recommendedRackets = MOCK_RACKETS;
    }
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
        state.error = action.payload ? action.payload : 'Unknown error during fetch.';
        state.recommendedRackets = [];
      });
  },
});

export const { 
    setPlaystyle, 
    setBalance, 
    setLevel, 
    setBudget, 
    setInitialRackets 
} = racketSlice.actions;

export default racketSlice.reducer;