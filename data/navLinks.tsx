import { ShoppingBag, History, Ticket, ShoppingCart } from 'lucide-react';
import { NavLink } from '@/interfaces/interfaces';

export const navLinks: NavLink[] = [
    {path: '/', label: 'Shops', icon: <ShoppingBag size={18} />},
    {path: '/history', label: 'History', icon: <History size={18} />},
    {path: '/coupons', label: 'Coupons', icon: <Ticket size={18} />},
    {path: '/cart', label: 'Cart', icon: <ShoppingCart size={20} />}
]