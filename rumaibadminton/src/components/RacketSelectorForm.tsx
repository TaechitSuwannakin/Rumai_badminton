import React, { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { fetchRecommendedRackets,setPlaystyle,setBalance, setLevel,setBudget,type Racket} from '../features/racket/racketSlice';

// --- Sub-Component: Playstyle Picker ---

interface PlaystyleOption {
  value: Racket['style_tag'];
  title: string;
  description: string;
}



const PLAYSTYLE_OPTIONS: PlaystyleOption[] = [
  { value: 'All-round', title: 'All-round', description: 'ทำได้ทุกอย่างกลาง ๆ เล่นคู่เล่นเดี่ยวได้หมด' },
  { value: 'Fast attack', title: 'Fast attack', description: 'ชอบบุกเร็ว ตัดจบไว เน้นสปีดการเล่น' },
  { value: 'Power smash', title: 'Power smash', description: 'เน้นฟาดหนัก กดคู่ต่อสู้ด้วยลูกตบ' },
  { value: 'Control / Defense', title: 'Control / Defense', description: 'เน้นรับ คุมจังหวะ วางลูกแม่น ๆ' },
];


const PlaystylePicker: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentStyle = useAppSelector(state => state.racket.playstyle);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-slate-700">สไตล์การเล่นหลัก</h3>
      <div className="grid grid-cols-2 gap-3 text-xs">
        {PLAYSTYLE_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => dispatch(setPlaystyle(option.value))}
            className={`rounded-2xl px-3 py-3 text-left transition-all shadow-sm
              ${currentStyle === option.value
                ? 'border border-emerald-500 bg-emerald-50'
                : 'border border-slate-200 hover:border-emerald-400'
              }`}
          >
            <div className={`font-semibold ${currentStyle === option.value ? 'text-emerald-800' : 'text-slate-900'}`}>{option.title}</div>
            <p className={`text-[11px] ${currentStyle === option.value ? 'text-emerald-900/80' : 'text-slate-500'}`}>
              {option.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

interface BalanceOption {
  value: Racket['balance_tag'];
  title: string;
  description: string;
}

const BALANCE_OPTIONS: BalanceOption[] = [
  { value: 'Head-light', title: 'Head-light (หัวเบา)', description: 'เหมาะกับสายเล่นหน้าเน็ต เคลื่อนตัวไว ตีโต้เร็ว' },
  { value: 'Even balance', title: 'Even balance (กลาง)', description: 'เล่นได้ทุกสไตล์ ทั้งหน้า–หลัง เหมาะกับสาย all-round' },
  { value: 'Head-heavy', title: 'Head-heavy (หัวหนัก)', description: 'เหมาะกับสายตบหนัก กดเกมจากด้านหลังคอร์ท' },
];

const BalancePicker: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentBalance = useAppSelector(state => state.racket.balance);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-slate-700">ฟีลไม้ที่ชอบ</h3>
      <div className="grid grid-cols-1 gap-2 text-xs">
        {BALANCE_OPTIONS.map((option) => (
          <label
            key={option.value}
            className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-all
                            ${currentBalance === option.value
                ? 'border border-emerald-500 bg-emerald-50'
                : 'border border-slate-200 hover:border-emerald-400'
              }`}
          >
            <input
              type="radio"
              name="balance"
              checked={currentBalance === option.value}
              onChange={() => dispatch(setBalance(option.value))}
              className="h-3 w-3 text-emerald-600 focus:ring-emerald-500"
            />
            <div>
              <div className="font-medium">{option.title}</div>
              <p className="text-[11px] text-slate-500">
                {option.description}
              </p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}


const LevelBudgetPicker: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentLevel = useAppSelector(state => state.racket.level);
  const currentBudget = useAppSelector(state => state.racket.budget);

  const LEVEL_OPTIONS = [
    'Beginner (เพิ่งเริ่มเล่น)',
    'Intermediate (เล่นก๊วนประจำ)',
    'Advanced (แข่งบ้างเป็นบางครั้ง)'
  ];

  const BUDGET_OPTIONS = [
    'ต่ำกว่า 1,500',
    '1,500 – 3,000',
    '3,000 ขึ้นไป'
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-slate-700">ระดับการเล่น</h3>
        <select
          value={currentLevel}
          onChange={(e) => dispatch(setLevel(e.target.value))}
          className="w-full border border-slate-200 rounded-2xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          {LEVEL_OPTIONS.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-slate-700">งบประมาณต่อไม้ (ประมาณ)</h3>
        <div className="flex flex-wrap gap-2 text-xs">
          {BUDGET_OPTIONS.map(option => (
            <button
              key={option}
              onClick={() => dispatch(setBudget(option))}
              className={`px-3 py-2 rounded-2xl transition-all
                                ${currentBudget === option
                  ? 'border border-emerald-500 bg-emerald-50'
                  : 'border border-slate-200 hover:border-emerald-400 bg-white'
                }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};


// --- Main Form Component ---

const RacketSelectorForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(state => state.racket.isLoading);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    // Dispatch the thunk to fetch recommended rackets based on current state
    dispatch(fetchRecommendedRackets());
  }, [dispatch]);

  return (
    <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 sm:p-6 space-y-6">
      <h2 className="text-lg font-semibold tracking-tight">
        เล่าให้เราฟังก่อนว่าคุณเล่นแบบไหน
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PlaystylePicker />
          <BalancePicker />
        </div>

        <LevelBudgetPicker />

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'กำลังค้นหา...' : 'ดูไม้ที่เหมาะกับฉัน'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default RacketSelectorForm;