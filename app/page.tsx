'use client';

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import ShopCard from '../components/ShopCard';
import ProductCard from '../components/ProductCard';
import api from '../lib/api';
import { BotMessageSquare, Store } from 'lucide-react';
import { Product, Shop } from '@/interfaces/interfaces';
import { useGetShopsQuery } from '@/store/apiSlice';
import { ALL_CATEGORIES } from '@/data/categories';
import Chat from '@/components/Chat';

export default function ShopsPage() {
  const [selectedShopId, setSelectedShopId] = useState<string | null>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState<'price' | 'name'>('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { data : shops = [], isLoading: isShopsLoading } = useGetShopsQuery(minRating)

  
  const { ref, inView } = useInView({ threshold: 0.1 });

  useEffect(() => {
    if (!selectedShopId) {
      setProducts([]);
      return;
    }

    const fetchInitialProducts = async () => {
      try {
        const res = await api.get(`/products`, {
          params: { 
            shopId: selectedShopId, 
            sortBy, 
            sortOrder, 
            page: 1, 
            limit: 8,
            ...(selectedCategories.length > 0 && { category: selectedCategories.join(',') }) 
          }
        });
        setProducts(res.data.products);
        console.log(products)
        setPage(1);
        setHasMore(res.data.currentPage < res.data.totalPages);
      } catch (err) {
        console.error('Failed to fetch products');
      }
    };
    fetchInitialProducts();
  }, [selectedShopId, sortBy, sortOrder, selectedCategories]);

  useEffect(() => {
    if (inView && hasMore && selectedShopId) {
      const fetchMore = async () => {
        try {
          const nextPage = page + 1;
          const res = await api.get(`/products`, {
            params: { 
              shopId: selectedShopId, 
              sortBy, 
              sortOrder, 
              page: nextPage, 
              limit: 8,
              ...(selectedCategories.length > 0 && { category: selectedCategories.join(',') })
            }
          });
          setProducts((prev) => [...prev, ...res.data.products]);
          setPage(nextPage);
          setHasMore(res.data.currentPage < res.data.totalPages);
        } catch (err) {
          console.error('Failed to load more products');
        }
      };
      
      const timer = setTimeout(() => {
        fetchMore();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [inView, hasMore, selectedShopId, sortBy, sortOrder, page, selectedCategories]);

  return (
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 tracking-tight flex items-center gap-2">
              <span className="w-2 h-6 bg-emerald-500 rounded-full"></span>
              Shops
            </h2>
            
            <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <label className="text-sm font-semibold text-gray-700 block mb-3 flex items-center justify-between">
                Min Rating <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md text-xs">{minRating.toFixed(1)}</span>
              </label>
              <input 
                type="range" 
                min="0" max="5" step="0.5" 
                value={minRating}
                onChange={(e) => setMinRating(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
                <span>0</span>
                <span>5</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
              <ShopCard 
                id={'all'}
                name={'All'}
                rating={5.0}
                isActive={selectedShopId === 'all'}
                onClick={setSelectedShopId}
              />
              
              <div className="my-2 border-t border-gray-100" /> 

              {shops.map((shop: Shop) => (
                <ShopCard 
                  key={shop._id}
                  id={shop._id}
                  name={shop.name}
                  rating={shop.rating}
                  imageUrl={shop.imageUrl}
                  isActive={selectedShopId === shop._id}
                  onClick={setSelectedShopId}
                />
              ))}

              {shops.length === 0 && (
                <div className="text-center py-10 px-4 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Store className="w-6 h-6 text-gray-300" />
                  </div>
                  <p className="text-sm font-medium text-gray-500">No shops match your rating filter</p>
                </div>
              )}
            </div>
          </div>
        </aside>

        <section className="flex-1 flex flex-col min-w-0">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
                Menu
              </h2>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider hidden sm:inline-block">Sort by:</span>
                <select 
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [newSortBy, newSortOrder] = e.target.value.split('-');
                    setSortBy(newSortBy as 'price' | 'name');
                    setSortOrder(newSortOrder as 'asc' | 'desc');
                  }}
                  className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:w-auto p-2.5 outline-none font-medium transition-shadow cursor-pointer"
                >
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 items-center pt-4 border-t border-gray-50">
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider mr-2">Categories:</span>
              <button
                onClick={() => setSelectedCategories([])}
                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                  selectedCategories.length === 0 
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {ALL_CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategories(prev => 
                      prev.includes(category) 
                        ? prev.filter(c => c !== category)
                        : [...prev, category]
                    )
                  }}
                  className={`px-4 py-1.5 rounded-full text-sm font-bold cursor-pointer capitalize transition-all ${
                    selectedCategories.includes(category)
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {products.length === 0 && selectedShopId && (
            <div className="flex-1 flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-50 shadow-sm mt-6">
              <svg className="w-16 h-16 text-gray-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-gray-400 text-lg font-medium">No products available in this shop.</span>
            </div>
          )}

          {hasMore && selectedShopId && (
            <div ref={ref} className="w-full flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            </div>
          )}
          {!hasMore && products.length > 0 && (
            <div className="w-full text-center py-10">
              <span className="bg-gray-100 text-gray-500 px-4 py-2 rounded-full text-sm font-medium">
                You&apos;ve reached the end of the catalogue.
              </span>
            </div>
          )}
        </section>
        <div 
          className='fixed bottom-4 right-4 bg-emerald-500 rounded-full p-2 cursor-pointer hover:bg-emerald-600 transition-colors hover:scale-110 shadow-lg shadow-emerald-500/20 transition-all duration-300'
          onClick={() => setIsChatOpen(prev => !prev)}
        >
          <BotMessageSquare className='h-10 w-10 text-white' />
        </div>
        {isChatOpen && <Chat isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} />}
      </main>
  );
}
