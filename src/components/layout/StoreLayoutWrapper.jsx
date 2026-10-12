'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import AnnouncementBar from './AnnouncementBar';
import Navbar from './Navbar';
import Footer from './Footer';

export default function StoreLayoutWrapper({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');

  if (isDashboard) {
    return <main>{children}</main>;
  }

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <AnnouncementBar />
        <Navbar />
        <main>{children}</main>
      </div>
      <Footer />
    </div>
  );
}
