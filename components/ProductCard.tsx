'use client';

import { useDispatch } from 'react-redux';
import { addItem } from '../store/cartSlice';
import Link from 'next/link';
import { ShoppingCart, Eye } from 'lucide-react';
import { Product } from '@/interfaces/interfaces';

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useDispatch();  

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
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
    <div className="group relative bg-white rounded-3xl p-3 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1 flex flex-col">
      
      <Link 
        href={`/product/${product._id}`} 
        className="relative h-52 w-full bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center"
      >
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <span className="text-gray-300 font-medium italic">No Preview</span>
          </div>
        )}

        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
             <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <Eye className="w-5 h-5 text-emerald-600" />
             </div>
        </div>
      </Link>

      <div className="p-3 flex flex-col flex-1">
        <div className="mb-1">
             <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md">
                {product.categoryId}
             </span>
        </div>
        
        <Link href={`/product/${product._id}`}>
          <h3 className="font-bold text-gray-800 text-lg leading-tight line-clamp-2 hover:text-emerald-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-tighter">Price</span>
            <span className="text-2xl font-black text-gray-900 leading-none">
              ${product.price.toFixed(0)}<span className="text-sm font-bold text-gray-500">.{(product.price % 1).toFixed(2).split('.')[1]}</span>
            </span>
          </div>

          <button 
            onClick={handleAddToCart}
            className={`
              relative flex items-center justify-center w-12 h-12 cursor-pointer rounded-2xl transition-all duration-300 active:scale-90 bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 hover:shadow-emerald-600/40
            `}
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}