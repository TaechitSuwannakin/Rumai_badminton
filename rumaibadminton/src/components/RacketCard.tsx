import React from 'react';
import type { Racket } from '../features/racket/racketSlice';

interface RacketCardProps {
  racket: Racket;
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
  const matchColor = getMatchColor(racket.match_percentage);
  const matchBarColor = getMatchBarColor(racket.match_percentage);

  return (
    <article
      className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-4 space-y-3 text-xs"
    >
      <div className="relative">
        <img 
          src={racket.image_url} // Replace with proper image handling
          alt={racket.model_name}
          className="w-full h-32 object-cover rounded-2xl" 
        />
        <span className="absolute bottom-2 left-2 px-2 py-1 rounded-full bg-black/60 text-[10px] text-white">
          {racket.style_tag}
        </span>
      </div>

      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-slate-400">{racket.brand}</p>
          <h3 className="text-sm font-semibold text-slate-900">
            {racket.model_name}
          </h3>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-400">Match</span>
          <div className="flex items-center gap-1">
            <span className={`text-xs font-semibold ${matchColor}`}>{racket.match_percentage}%</span>
            <span className="h-1.5 w-10 bg-slate-100 rounded-full overflow-hidden">
              <span className={`block h-full ${matchBarColor}`} style={{ width: `${racket.match_percentage}%` }}></span>
            </span>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-slate-600">
        {racket.balance_tag} · {racket.flex} shaft · {racket.description}
      </p>

      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <div className="rounded-2xl bg-slate-50 border border-slate-100 px-3 py-2">
          <p className="text-[10px] text-slate-400">สไตล์</p>
          <p className="font-medium text-slate-800">{racket.style_tag}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 border border-slate-100 px-3 py-2">
          <p className="text-[10px] text-slate-400">Balance</p>
          <p className="font-medium text-slate-800">{racket.balance_tag}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 border border-slate-100 px-3 py-2">
          <p className="text-[10px] text-slate-400">ระดับผู้เล่น</p>
          <p className="font-medium text-slate-800">{racket.player_level}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 border border-slate-100 px-3 py-2">
          <p className="text-[10px] text-slate-400">ช่วงราคา</p>
          <p className="font-medium text-slate-800">{racket.price.toLocaleString()} ฿</p>
        </div>
      </div>
      
      {/* Link section */}
      <div className="pt-1">
        <a href={`/rackets/${racket.id}`} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 hover:text-emerald-800">
          ดูเพิ่มเติม
          <span>↗</span>
        </a>
      </div>
    </article>
  );
};

export default RacketCard;