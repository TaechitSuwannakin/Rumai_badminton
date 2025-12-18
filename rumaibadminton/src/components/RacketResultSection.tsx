import React from 'react';
import { useAppSelector } from '../app/hooks';
import RacketCard from './RacketCard';

const RacketResultSection: React.FC = () => {
  const { recommendedRackets, isLoading, error } = useAppSelector(state => state.racket);

  return (
    <section className="space-y-4 pb-10">
      <div className="flex items-center justify-between ">
        <h2 className="text-lg sm:text-xl font-semibold tracking-tight">
          ไม้ที่น่าจะเหมาะกับคุณ ({recommendedRackets.length})
        </h2>
      </div>

      {isLoading && (
        <div className="text-center py-10 text-slate-500">
          <div className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-emerald-600 rounded-full"></div>
          <p className="mt-2">กำลังค้นหาไม้แบดที่เหมาะกับคุณ...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">
          เกิดข้อผิดพลาด: {error}
        </div>
      )}
      
      {!isLoading && !error && recommendedRackets.length === 0 && (
          <div className="text-center py-10 text-slate-500 bg-white border border-slate-100 rounded-xl">
              <p>ไม่พบไม้แบดที่ตรงกับตัวเลือกของคุณ กรุณาลองปรับตัวเลือกใหม่</p>
          </div>
      )}

      {!isLoading && recommendedRackets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {recommendedRackets.map((racket) => (
            <RacketCard key={racket.id} racket={racket} />
          ))}
        </div>
      )}
    </section>
  );
};

export default RacketResultSection; 