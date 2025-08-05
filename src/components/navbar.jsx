'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const menuItems = [
    { href: '/', label: 'Homepage' },
    { href: '/about', label: 'About us' },
    { href: '/features', label: 'Features' },
    { href: '/posts', label: 'Blog' },
    { href: '/contact', label: 'Contact us' },
  ];

  return (
    <nav className="flex justify-between items-center py-4 px-4 sm:px-8 bg-white border-b border-gray-100 relative z-50">
      {/* Logo */}
      <Link href="/" className="text-xl font-bold flex items-center space-x-2 hover:opacity-80 transition-opacity">
        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
          <div className="w-4 h-4 bg-white rounded-full"></div>
        </div>
        <span>Beyond UI</span>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex space-x-8 text-sm font-medium text-gray-600">
        {menuItems.map((item) => (
          <Link 
            key={item.href}
            href={item.href} 
            className="hover:text-gray-900 transition-colors py-2"
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Desktop CTA Buttons */}
      <div className="hidden md:flex space-x-3">
        <button className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
          Demo
        </button>
        <button className="px-4 py-2 text-sm font-medium bg-black text-white rounded-md hover:bg-gray-800 transition-colors">
          Get Started
        </button>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
        aria-label="Toggle menu"
        aria-expanded={isMenuOpen}
      >
        {isMenuOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={closeMenu}
          />
          
          {/* Menu Panel */}
          <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50 md:hidden">
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Navigation Links */}
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className="block text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors py-2"
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Mobile CTA Buttons */}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <button 
                  className="w-full px-4 py-3 text-sm font-medium border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                  onClick={closeMenu}
                >
                  Demo
                </button>
                <button 
                  className="w-full px-4 py-3 text-sm font-medium bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                  onClick={closeMenu}
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
