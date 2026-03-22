'use client'

import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { usePathname } from 'next/navigation';
import { navLinks } from '@/data/navLinks';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link href="/" className="text-2xl font-bold text-emerald-600 tracking-tight">
        <span className="text-gray-900">Delivery<span className="text-emerald-600 text-3xl">.</span></span>
      </Link>
      
      <div className="hidden md:flex gap-8 items-center">
        {navLinks.map((link) => (
          link.path === '/cart' ? (
            <Link key={link.path} href={link.path} className={`relative flex items-center gap-2 hover:text-emerald-500 font-medium transition-colors ${pathname === link.path ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-gray-600'}`}>
              {link.label} {link.icon}
              <span className="absolute -top-3 -right-3 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm border-2 border-white">
                {totalItems}
              </span>
            </Link>
          ) : (
            <Link key={link.path} href={link.path} className={`flex items-center gap-2 hover:text-emerald-500 font-medium transition-colors ${pathname === link.path ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-gray-600'}`}>
              {link.icon} {link.label}
            </Link>
          )
        ))}
      </div>

      <div className="md:hidden flex items-center">
        <button 
          onClick={toggleMenu} 
          className="text-gray-900 focus:outline-none hover:text-emerald-600 transition-colors" 
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg flex flex-col items-center py-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setIsMenuOpen(false)}
              className={`py-4 w-full flex items-center justify-center gap-3 hover:bg-emerald-50 hover:text-emerald-500 font-medium transition-colors ${
                pathname === link.path ? 'text-emerald-600 bg-emerald-50/50' : 'text-gray-600'
              }`}
            >
              {link.icon} 
              <span className="text-lg">{link.label}</span>
              {link.path === '/cart' && totalItems > 0 && (
                <span className="bg-red-500 text-white text-[12px] font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-sm ml-1">
                  {totalItems}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
