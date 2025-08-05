'use client';

import React, { useState } from 'react';
import Navbar from '@/components/navbar';
import Hero from '@/components/hero';
import RecentPosts from '@/components/recent';

const Page = () => {
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero onSearch={setGlobalSearchTerm} />
      <RecentPosts searchTerm={globalSearchTerm} />
    </div>
  );
}

export default Page;
