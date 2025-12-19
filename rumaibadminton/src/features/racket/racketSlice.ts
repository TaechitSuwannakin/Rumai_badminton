import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabaseClient';

// --- 1) Define Core Data Types ---
export interface Racket {
  id: number;
  brand: string;
  model_name: string;
  flex: 'Flexible' | 'Medium' | 'Stiff';
  style_tag: 'All-round' | 'Fast attack' | 'Power smash' | 'Control / Defense';
  balance_tag: 'Head-light' | 'Even balance' | 'Head-heavy';
  player_level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: number;
  description: string | null;

  // ✅ เก็บ path จาก Supabase Storage
  image_path: string | null;

  // ✅ สร้างเพิ่มสำหรับ UI (ไม่ต้องมีใน DB)
  image_url?: string | null;

  match_percentage: number | null;
}

// --- 2) Define State Type ---
export interface RacketState {
  playstyle: Racket['style_tag'];
  balance: Racket['balance_tag'] | 'Any';
  level: string;
  budget: string;

  recommendedRackets: Racket[];
  isLoading: boolean;
  error: string | null;
}

// --- 3) Initial State ---
const initialState: RacketState = {
  playstyle: 'All-round',
  balance: 'Even balance',
  level: 'Beginner (เพิ่งเริ่มเล่น)',
  budget: '1,500 – 3,000',

  recommendedRackets: [],
  isLoading: false,
  error: null,
};

// --- Helper: image_path -> public URL (Public bucket) ---
const toPublicImageUrl = (image_path: string | null) => {
  if (!image_path) return null;
  return supabase.storage.from('rackets').getPublicUrl(image_path).data.publicUrl;
};

// --- 4) Async Thunk: Fetch from Supabase ---
export const fetchRecommendedRackets = createAsyncThunk<
  Racket[],
  Omit<RacketState, 'recommendedRackets' | 'isLoading' | 'error'>,
  { rejectValue: string }
>('racket/fetchRecommendedRackets', async (filters, { rejectWithValue }) => {
  try {
    let query = supabase.from('rackets').select('*');

    // ✅ Filter ตามที่มีในฟอร์มตอนนี้
    if (filters.playstyle && filters.playstyle !== 'All-round') {
      query = query.eq('style_tag', filters.playstyle);
    }
    if (filters.balance && filters.balance !== 'Any') {
      query = query.eq('balance_tag', filters.balance);
    }

    // (ถ้าจะทำ level/budget ให้กรองจริง ค่อยเพิ่มทีหลัง)

    const { data, error } = await query.limit(50);

    if (error) return rejectWithValue(error.message);

    type RacketRow = Omit<Racket, 'image_url'>;

    const rackets: Racket[] = ((data ?? []) as RacketRow[]).map((r) => ({
      ...r,
      image_url: toPublicImageUrl(r.image_path),
      match_percentage: calculateMatchPercentage(r as Racket, filters),
    }));

    return rackets;
  } catch (e: any) { return rejectWithValue(e?.message ?? 'การดึงข้อมูลไม้แบดล้มเหลว กรุณาลองใหม่'); }
});

// --- 5) Create Slice ---
export const racketSlice = createSlice({
  name: 'racket',
  initialState,
  reducers: {
    setPlaystyle: (state, action: PayloadAction<Racket['style_tag']>) => {
      state.playstyle = action.payload;
    },
    // ✅ ให้รับ 'Any' ได้ (ของเดิมทอยเคยรับแค่ balance_tag)
    setBalance: (state, action: PayloadAction<Racket['balance_tag'] | 'Any'>) => {
      state.balance = action.payload;
    },
    setLevel: (state, action: PayloadAction<string>) => {
      state.level = action.payload;
    },
    setBudget: (state, action: PayloadAction<string>) => {
      state.budget = action.payload;
    },

    // ✅ อันนี้ไม่จำเป็นแล้ว (เพราะดึงจาก Supabase) แต่เก็บไว้ก็ได้
    // ถ้าจะใช้ ให้ใส่ข้อมูลเองจากภายนอก
    setInitialRackets: (state, action: PayloadAction<Racket[]>) => {
      state.recommendedRackets = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommendedRackets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRecommendedRackets.fulfilled, (state, action) => {
        state.isLoading = false;

        state.recommendedRackets = [...action.payload].sort(
          (a, b) => (b.match_percentage ?? 0) - (a.match_percentage ?? 0)
        );
      })

      .addCase(fetchRecommendedRackets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ? action.payload : 'Unknown error during fetch.';
        state.recommendedRackets = [];
      });
  },
});
type Filters = {
  playstyle: Racket['style_tag'];
  balance: Racket['balance_tag'] | 'Any';
  level: string;
  budget: string;
};

const calculateMatchPercentage = (r: Racket, f: Filters) => {
  let score = 0;
  let total = 0;

  // 1) สไตล์การเล่น (น้ำหนักมาก)
  total += 40;
  if (r.style_tag === f.playstyle) score += 40;

  // 2) Balance / น้ำหนักไม้
  total += 25;
  if (f.balance === 'Any' || r.balance_tag === f.balance) score += 25;

  // 3) ระดับผู้เล่น
  total += 15;
  if (r.player_level && f.level.includes(r.player_level)) score += 15;

  // 4) งบประมาณ (แบบง่าย)
  total += 20;
  if (f.budget) {
    // ดึงตัวเลขจากข้อความงบ เช่น "1,500 – 3,000"
    const nums = f.budget.match(/\d+/g)?.map(Number);
    if (nums && nums.length >= 2) {
      const [min, max] = nums;
      if (r.price >= min && r.price <= max) score += 20;
    }
  }

  return Math.round((score / total) * 100);
};


export const { setPlaystyle, setBalance, setLevel, setBudget, setInitialRackets } =
  racketSlice.actions;

export default racketSlice.reducer;
