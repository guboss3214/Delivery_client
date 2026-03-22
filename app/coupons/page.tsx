'use client';

import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { useDispatch } from 'react-redux';
import { applyCoupon } from '../../store/cartSlice';
import { TicketPercent, CheckCircle, Copy } from 'lucide-react';

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await api.get('/coupons');
        setCoupons(res.data);
      } catch (err) {
        console.error('Failed to fetch coupons');
      }
    };
    fetchCoupons();
  }, []);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    
    setLoading(true);
    setMessage(null);
    
    try {
      const res = await api.post('/coupons/verify', { code });
      dispatch(applyCoupon(res.data.discountPercentage));
      setMessage({ text: `Success! ${res.data.discountPercentage}% discount applied to your cart.`, type: 'success' });
    } catch (err: any) {
      setMessage({ text: err.response?.data?.message || 'Invalid coupon', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setMessage({ text: `Copied ${text} to clipboard!`, type: 'success' });
    setTimeout(() => setMessage(null), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 tracking-tight flex items-center gap-3">
          <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
          Coupons & Promos
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800 mb-6 tracking-tight">Available Coupons</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {coupons.map(coupon => (
                <div key={coupon._id} className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-md relative overflow-hidden group">
                  <div className="absolute -right-6 -top-6 text-emerald-400 opacity-20 transform group-hover:scale-110 transition-transform">
                    <TicketPercent size={120} />
                  </div>
                  <div className="relative z-10">
                    <div className="text-4xl font-extrabold mb-1">{coupon.discountPercentage}% OFF</div>
                    <div className="text-emerald-100 font-medium mb-6">Use this code at checkout</div>
                    
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 flex items-center justify-between border border-white/30 cursor-pointer hover:bg-white/30 transition-colors" onClick={() => copyToClipboard(coupon.code)}>
                      <span className="font-mono font-bold tracking-widest text-lg">{coupon.code}</span>
                      <Copy size={18} />
                    </div>
                  </div>
                </div>
              ))}
              {coupons.length === 0 && (
                <div className="text-gray-500 bg-white p-6 rounded-2xl border border-gray-100">No coupons currently available.</div>
              )}
            </div>
          </div>

          <div className="w-full lg:w-96">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-28">
              <h2 className="text-xl font-bold text-gray-800 mb-4 pb-4 border-b border-gray-100">Apply a Code</h2>
              <form onSubmit={handleApplyCoupon} className="flex flex-col gap-4">
                <div>
                  <input 
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="ENTER CODE"
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow text-center font-mono font-bold tracking-wider text-xl uppercase"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={loading || !code}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : 'Apply Discount'}
                </button>
              </form>
              
              {message && (
                <div className={`mt-4 p-4 rounded-xl flex items-start gap-3 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-red-50 text-red-800 border border-red-100'}`}>
                  {message.type === 'success' ? <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={18} /> : null}
                  <span className="text-sm font-medium">{message.text}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
