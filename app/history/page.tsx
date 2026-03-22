'use client';

import { useState } from 'react';
import api from '../../lib/api';
import { useDispatch } from 'react-redux';
import { reorderItems } from '../../store/cartSlice';
import { Search, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HistoryPage() {
  const [searchBy, setSearchBy] = useState<'email' | 'phone' | 'orderId'>('email');
  const [searchValue, setSearchValue] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchValue) return;
    
    setLoading(true);
    setError('');
    
    try {
      const res = await api.get(`/orders`, {
        params: { [searchBy]: searchValue }
      });
      setOrders(res.data);
      if (res.data.length === 0) {
        setError('No orders found with that information.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to search orders');
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = (order: any) => {
    const items = order.items.map((i: any) => ({
      productId: i.productId._id,
      shopId: i.productId.shopId,
      name: i.productId.name,
      price: i.price,
      quantity: i.quantity,
      imageUrl: i.productId.imageUrl
    }));
    
    dispatch(reorderItems(items));
    router.push('/cart');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 tracking-tight flex items-center gap-3">
          <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
          Order History
        </h1>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search By</label>
              <select 
                value={searchBy}
                onChange={(e) => setSearchBy(e.target.value as 'email' | 'phone' | 'orderId')}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
              >
                <option value="email">Email</option>
                <option value="phone">Phone Number</option>
                <option value="orderId">Order ID</option>
              </select>
            </div>
            <div className="flex-[2] w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
              <input 
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={`Enter your ${searchBy}...`}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow"
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <><Search size={18} /> Search</>}
            </button>
          </form>
          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        </div>

        <div className="flex flex-col gap-6">
          {orders.map(order => (
            <div key={order._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-4 mb-4 gap-4">
                <div>
                  <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-1">Order #{order._id.slice(-8)}</div>
                  <div className="text-gray-900 font-medium">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</div>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-2xl font-bold text-gray-900">${order.totalPrice.toFixed(2)}</div>
                  <button 
                    onClick={() => handleReorder(order)}
                    className="bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 px-5 py-2 rounded-xl font-bold transition-colors flex items-center gap-2"
                  >
                    <ShoppingBag size={18} /> Reorder
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider bg-gray-50 inline-block px-3 py-1 rounded-md">Items</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 border border-gray-50 p-2 rounded-lg bg-gray-50/50">
                      <div className="w-12 h-12 bg-white rounded-md overflow-hidden shrink-0 border border-gray-100">
                        {item.productId?.imageUrl ? (
                          <img src={item.productId.imageUrl} alt={item.productId?.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-gray-800 truncate">{item.productId?.name || 'Unknown Item'}</div>
                        <div className="text-xs text-gray-500">{item.quantity} x ${item.price.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
