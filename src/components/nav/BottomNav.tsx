
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, LayoutGrid, BarChart3, HeartPulse, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import TrackPeriodModal from '../dashboard/TrackPeriodModal';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutGrid },
  { href: '/recommendations', label: 'Tips', icon: HeartPulse },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/analysis', label: 'Analysis', icon: BarChart3 },
];

const NavLink = ({ href, label, icon: Icon }: (typeof navItems)[0]) => {
    const pathname = usePathname();
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className="flex w-1/5 flex-col items-center justify-center gap-1 text-muted-foreground transition-colors duration-300 hover:text-primary"
      >
        <Icon
          className={cn('h-6 w-6 transition-all', isActive ? 'text-primary' : '')}
          strokeWidth={isActive ? 2.5 : 2}
        />
        <span
          className={cn(
            'text-xs font-medium transition-colors',
            isActive ? 'text-primary' : ''
          )}
        >
          {label}
        </span>
      </Link>
    );
};


const BottomNav = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const leftItems = navItems.slice(0, 2);
    const rightItems = navItems.slice(2);

    return (
      <>
        <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/20 bg-background/70 backdrop-blur-lg">
            <div className="container mx-auto flex h-20 max-w-md items-center justify-center">
                {leftItems.map((item) => <NavLink key={item.href} {...item} />)}
                
                <div 
                    onClick={() => setIsModalOpen(true)}
                    className={cn(
                        "flex items-center justify-center h-16 w-16 rounded-full bg-primary shadow-lg -translate-y-4 cursor-pointer"
                    )}
                >
                    <Plus className="h-8 w-8 text-primary-foreground" />
                </div>

                {rightItems.map((item) => <NavLink key={item.href} {...item} />)}
            </div>
        </nav>
        <TrackPeriodModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
      </>
    );
};

export default BottomNav;
