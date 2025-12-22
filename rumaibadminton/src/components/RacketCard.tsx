import React, { useState } from 'react';
import type { Racket } from '../features/racket/racketSlice';
import ReviewBar from './ReviewBar.tsx';

interface RacketWithMatch extends Racket {
  match_percentage?: number;
}

interface RacketCardProps {
  racket: RacketWithMatch;
}

const getMatchColor = (percentage: number) => {
    if (percentage >= 85) return 'text-emerald-700';
    if (percentage >= 70) return 'text-amber-700';
    return 'text-sky-700';
}

const getMatchBarColor = (percentage: number) => {
    if (percentage >= 85) return 'bg-emerald-400';
    if (percentage >= 70) return 'bg-amber-400';
    return 'bg-sky-400';
}

const RacketCard: React.FC<RacketCardProps> = ({ racket }) => {
  const [isReviewBarOpen, setIsReviewBarOpen] = useState(false);

  const safeMatchPercentage = racket.match_percentage ?? 0;
  const matchColor = getMatchColor(safeMatchPercentage);
  const matchBarColor = getMatchBarColor(safeMatchPercentage);

  // 🗑️ ลบ handleSubmitReview ทิ้งไปแล้ว เพราะย้ายไปทำใน ReviewBar แทน

  // สร้างลิงก์ค้นหา Shopee
  const searchQuery = `${racket.brand} ${racket.model_name}`; 
  const shopeeSearchUrl = `https://shopee.co.th/search?keyword=${encodeURIComponent(searchQuery)}`;

  return (
    <>
      <article className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 p-4 space-y-3 text-xs flex flex-col h-full relative">
        {/* รูปภาพ */}
        <div className="relative overflow-hidden rounded-2xl bg-slate-50">
          <img 
            src={racket.image_url || 'https://via.placeholder.com/300x200?text=No+Image'} 
            alt={racket.model_name}
            className="w-full h-32 object-contain transition-transform duration-500 group-hover:scale-110" 
          />
          <span className="absolute bottom-2 left-2 px-2 py-1 rounded-full bg-black/60 text-[10px] text-white backdrop-blur-sm">
            {racket.style_tag || 'General'}
          </span>
        </div>

        {/* ข้อมูลไม้แบด */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              {racket.brand || 'Unknown Brand'}
            </p>
            <h3 className="text-sm font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">
              {racket.model_name}
            </h3>
          </div>
          
          {typeof racket.match_percentage !== 'undefined' && (
            <div className="text-right">
              <span className="text-[10px] text-slate-400">Match</span>
              <div className="flex items-center gap-1">
                <span className={`text-xs font-semibold ${matchColor}`}>
                  {safeMatchPercentage}%
                </span>
                <span className="h-1.5 w-10 bg-slate-100 rounded-full overflow-hidden">
                  <span 
                    className={`block h-full ${matchBarColor}`} 
                    style={{ width: `${safeMatchPercentage}%` }}
                  ></span>
                </span>
              </div>
            </div>
          )}
        </div>

        <p className="text-[11px] text-slate-600 line-clamp-2">
          {racket.balance_tag} · {racket.flex || '-'} shaft · {racket.description || ''}
        </p>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="rounded-2xl bg-slate-50 border border-slate-100 px-3 py-2">
            <p className="text-[10px] text-slate-400">ระดับผู้เล่น</p>
            <p className="font-medium text-slate-800 truncate">{racket.player_level || '-'}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 border border-slate-100 px-3 py-2">
            <p className="text-[10px] text-slate-400">ช่วงราคา</p>
            <p className="font-medium text-slate-800">
              {(racket.price ?? 0).toLocaleString()} ฿
            </p>
          </div>
        </div>
        
        <div className="flex-grow"></div>

        {/* ปุ่มกด */}
        <div className="pt-3 border-t border-slate-100 flex justify-between items-center mt-2">
          <button 
            onClick={() => setIsReviewBarOpen(true)}
            className="text-[11px] font-medium text-slate-500 hover:text-emerald-600 flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-slate-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            รีวิว
          </button>

          <a 
            href={shopeeSearchUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-full transition-colors border border-orange-100"
          >
            เช็คราคา
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          </a>
        </div>

        {/* เรียกใช้ ReviewBar */}
        <ReviewBar 
           isOpen={isReviewBarOpen}
           onClose={() => setIsReviewBarOpen(false)}
           racketName={racket.model_name}
           racketId={racket.id}
         />
      </article>
    </>
  );
};

export default RacketCard;