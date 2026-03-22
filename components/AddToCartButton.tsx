'use client';

import { useDispatch } from 'react-redux';
import { addItem } from '@/store/cartSlice';
import { Product } from '@/interfaces/interfaces';

export default function AddToCartButton({ product }: { product: Product }) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addItem({
      productId: product._id,
      shopId: product.shopId,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl
    }));
  };

  return (
    <button 
      onClick={handleAddToCart} 
      className="flex-1 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-emerald-500/30 cursor-pointer transform transition-all active:scale-95 text-lg"
    >
      Add to Cart
    </button>
  );
}
