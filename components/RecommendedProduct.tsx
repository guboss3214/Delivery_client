'use client'

import { Product } from "@/interfaces/interfaces";
import Link from "next/link";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { useDispatch } from "react-redux";
import { addItem } from "@/store/cartSlice";

export default function RecommendedProduct({product}: {product: Product}) {
    const dispatch = useDispatch()
    return (
        <div className='flex justify-start mt-2 animate-in fade-in slide-in-from-left-2 duration-300'>
            <div className='max-w-[90%] p-4 rounded-2xl bg-white border border-emerald-100 shadow-sm hover:shadow-md transition-all group'>

                <div className='flex items-start space-x-3'>
                    <Link href={`/product/${product._id}`} className="shrink-0 relative overflow-hidden rounded-xl">
                        <img 
                            src={product.imageUrl} 
                            alt={product.name} 
                            className='w-16 h-16 object-cover transform group-hover:scale-110 transition-transform duration-300' 
                        />
                    </Link>
                    
                    <div className='flex-1 min-w-0'>
                        <Link href={`/product/${product._id}`}>
                            <p className='font-bold text-gray-800 leading-tight truncate hover:text-emerald-600 transition-colors'>
                                {product.name}
                            </p>
                        </Link>
                        <p className='text-emerald-600 font-extrabold text-lg'>${product.price}</p>
                    </div>
                </div>

                <div className='mt-3 pt-3 border-t border-gray-50 flex items-center justify-between space-x-2'>
                    <Link 
                        href={`/product/${product._id}`}
                        className='text-xs font-semibold text-gray-500 hover:text-emerald-600 flex items-center gap-1 transition-colors'
                    >
                        View Details <ArrowRight size={12} />
                    </Link>
                    
                    <button 
                        onClick={() => dispatch(addItem({
                            productId: product._id,
                            shopId: product.shopId,
                            name: product.name,
                            price: product.price,
                            quantity: 1,
                            imageUrl: product.imageUrl
                        }))}
                        className='bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-lg transition-colors shadow-sm shadow-emerald-200 active:scale-95'
                        title="Add to cart"
                    >
                        <ShoppingCart size={16} />
                    </button>
                </div>
            </div>
        </div>
    )
}