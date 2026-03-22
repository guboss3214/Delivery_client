'use client';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { updateQuantity, removeItem, clearCart } from '../../store/cartSlice';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../../lib/api';
import { Trash2, MapPin } from 'lucide-react';
import Redirect from '@/components/Redirect';
import dynamic from 'next/dynamic';

const AddressMap = dynamic(() => import('@/components/AddressMap'), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-gray-100 animate-pulse rounded-xl flex items-center justify-center text-gray-400">Loading Map...</div>
});

const checkoutSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CartPage() {
  const dispatch = useDispatch();
  const { items, couponDiscount } = useSelector((state: RootState) => state.cart);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema)
  });
  const [showMap, setShowMap] = useState(false);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = (subtotal * couponDiscount) / 100;
  const totalPrice = subtotal - discountAmount;

  const onSubmit = async (data: CheckoutForm) => {
    if (items.length === 0) return;
    setIsSubmitting(true);
    try {
      const orderData = {
        ...data,
        items: items.map(i => ({
          productId: i.productId,
          quantity: i.quantity,
          price: i.price
        })),
        totalPrice
      };
      await api.post('/orders', orderData);
      dispatch(clearCart());
      setSuccess(true);
    } catch (err) {
      console.error('Checkout failed', err);
      alert('Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <main className="flex-1 flex flex-col items-center justify-center p-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-emerald-100 flex flex-col items-center max-w-md w-full text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Order Confirmed!</h2>
              <p className="text-gray-600 mb-8">Your delicious food is on its way to you.</p>
              <Redirect />
              <button 
                onClick={() => window.location.href = '/'}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-medium transition-colors"
              >
                Back to Shops
              </button>
            </div>
          </main>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 tracking-tight flex items-center gap-3">
          <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
          Shopping Cart
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 flex flex-col gap-4">
            {items.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center flex flex-col items-center justify-center min-h-[400px]">
                <svg className="w-20 h-20 text-gray-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h3>
                <p className="text-gray-500 mb-6">Looks like you haven't added any items yet.</p>
                <button 
                  onClick={() => window.location.href = '/'}
                  className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-6 py-2.5 rounded-full font-medium transition-colors"
                >
                  Start Ordering
                </button>
              </div>
            ) : (
              items.map(item => (
                <div key={item.productId} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-4 hover:shadow-md transition-shadow">
                  <div className="w-full sm:w-24 h-24 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                    )}
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-semibold text-gray-800 text-lg line-clamp-1">{item.name}</h3>
                    <div className="text-emerald-600 font-bold mt-1">${item.price.toFixed(2)}</div>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-lg border border-gray-200">
                    <button 
                      onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: Math.max(1, item.quantity - 1) }))}
                      className="w-8 h-8 flex items-center justify-center bg-white rounded-md text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 shadow-sm transition-colors font-medium"
                    >
                      -
                    </button>
                    <span className="w-8 flex items-center justify-center font-semibold text-gray-800">{item.quantity}</span>
                    <button 
                      onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity + 1 }))}
                      className="w-8 h-8 flex items-center justify-center bg-white rounded-md text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 shadow-sm transition-colors font-medium"
                    >
                      +
                    </button>
                  </div>
                  <div className="font-bold text-gray-800 w-20 text-right">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                  <button 
                    onClick={() => dispatch(removeItem(item.productId))}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-2"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="w-full lg:w-[400px] shrink-0">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-28">
              <h2 className="text-xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-100">Checkout</h2>
              
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input 
                    {...register('name')} 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" 
                    placeholder="John Doe"
                  />
                  {errors.name && <span className="text-red-500 text-xs mt-1 block">{errors.name.message}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    {...register('email')} 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" 
                    placeholder="john@example.com"
                  />
                  {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email.message}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input 
                    {...register('phone')} 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" 
                    placeholder="1234567890"
                  />
                  {errors.phone && <span className="text-red-500 text-xs mt-1 block">{errors.phone.message}</span>}
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <button
                      type="button"
                      onClick={() => setShowMap(!showMap)}
                      className="text-xs flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-semibold transition-colors bg-emerald-50 px-2 py-1 rounded-md"
                    >
                      <MapPin size={14} />
                      {showMap ? 'Hide Map' : 'Select on Map'}
                    </button>
                  </div>
                  {showMap && (
                    <div className="mb-3 animate-in fade-in slide-in-from-top-2 duration-300">
                      <AddressMap 
                        onLocationSelect={(addr) => {
                          setValue('address', addr, { shouldValidate: true, shouldDirty: true });
                          setShowMap(false);
                        }} 
                      />
                      <p className="text-xs text-gray-500 mt-2 text-center font-medium bg-gray-50 p-2 rounded-lg border border-gray-100">Click anywhere on the map to automatically fill your address.</p>
                    </div>
                  )}
                  <textarea 
                    {...register('address')} 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none h-24" 
                    placeholder="123 Main St, City"
                  ></textarea>
                  {errors.address && <span className="text-red-500 text-xs mt-1 block">{errors.address.message}</span>}
                </div>

                <div className="mt-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="flex justify-between text-gray-600 mb-2">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium mb-2">
                      <span>Discount ({couponDiscount}%)</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-bold text-gray-900 mt-4 pt-4 border-t border-gray-200">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={items.length === 0 || isSubmitting}
                  className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold tracking-wide transition-colors flex justify-center items-center"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    'Submit Order'
                  )}
                </button>
                <button 
                  type="button" 
                  disabled={items.length === 0 || isSubmitting}
                  onClick={() => dispatch(clearCart())}
                  className="mt-4 w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold tracking-wide transition-colors flex justify-center items-center"
                >
                  Clear Cart
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
