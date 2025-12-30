import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient'; // ⚠️ เช็คว่า path นี้ถูกต้อง

interface Review {
  id: number;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface ReviewBarProps {
  isOpen: boolean;
  onClose: () => void;
  racketName: string;
  racketId: number; // รับ ID มาเพื่อดึงข้อมูลให้ตรงรุ่น
}

const ReviewBar: React.FC<ReviewBarProps> = ({ isOpen, onClose, racketName, racketId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // --- 1. ฟังก์ชันดึงรีวิว (ประกาศไว้บนสุด) ---
  const fetchReviews = async () => {
    if (!racketId) return;

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('racket_id', racketId) // ดึงเฉพาะของไม้รุ่นนี้
      .order('created_at', { ascending: false }); // เอาใหม่สุดขึ้นก่อน

    if (error) {
      console.error('Error loading reviews:', error);
    } else {
      setReviews(data || []);
    }
  };

  // --- 2. โหลดข้อมูลเมื่อเปิดหน้าต่าง ---
  useEffect(() => {
    if (isOpen) {
      fetchReviews();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, racketId]);

  // --- 3. ฟังก์ชันส่งรีวิว ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return alert('ขอดาวหน่อยนะครับ ⭐');

    setIsLoading(true);
    
    // ยิงขึ้น Supabase
    const { error } = await supabase.from('reviews').insert([
      {
        racket_id: racketId,
        rating: rating,
        comment: comment,
        reviewer_name: 'Guest'
      }
    ]);

    if (error) {
      console.error('Save error:', error);
      alert('บันทึกไม่สำเร็จ T_T');
    } else {
      // เคลียร์ค่า และโหลดรีวิวใหม่ทันที
      setRating(0);
      setComment('');
      await fetchReviews(); 
      alert('บันทึกรีวิวเรียบร้อย!');
    }
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* หัวข้อ */}
        <div className="bg-slate-50 px-6 py-4 flex justify-between items-center border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-800">รีวิวจากผู้ใช้จริง</h3>
            <p className="text-xs text-slate-500">{racketName}</p>
          </div>
          <button onClick={onClose} className="text-2xl text-slate-400 hover:text-red-500">&times;</button>
        </div>

        {/* พื้นที่เนื้อหา (Scroll ได้) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* ฟอร์มเขียนรีวิว */}
          <form onSubmit={handleSubmit} className="space-y-3 pb-6 border-b border-slate-100">
            <p className="text-sm font-semibold text-slate-700">ให้คะแนนไม้รุ่นนี้</p>
            
            {/* ดาวกดได้ */}
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-3xl transition-transform hover:scale-110 ${
                    star <= rating ? 'text-amber-400' : 'text-slate-200'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              className="w-full bg-slate-50 rounded-xl p-3 text-sm focus:outline-emerald-500"
              placeholder="เล่าความรู้สึกตอนตีหน่อยครับ..."
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-slate-900 text-white py-2 rounded-xl text-sm font-bold hover:bg-emerald-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'กำลังส่ง...' : 'ส่งรีวิว'}
            </button>
          </form>

          {/* รายการรีวิวคนอื่น */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-800">ความคิดเห็น ({reviews.length})</h4>
            
            {reviews.length === 0 ? (
              <div className="text-center py-4 text-slate-400 text-xs">
                ยังไม่มีรีวิว เป็นคนแรกเลยไหม? 😊
              </div>
            ) : (
              reviews.map((item) => (
                <div key={item.id} className="bg-slate-50 p-3 rounded-xl">
                  <div className="flex justify-between">
                    <span className="text-xs font-bold text-slate-700">{item.reviewer_name}</span>
                    <span className="text-amber-400 text-xs">{'★'.repeat(item.rating)}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{item.comment}</p>
                  <p className="text-[10px] text-slate-400 text-right mt-1">
                    {new Date(item.created_at).toLocaleDateString('th-TH')}
                  </p>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ReviewBar;