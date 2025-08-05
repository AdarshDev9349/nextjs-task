'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

const SearchBar = ({ onSearch, placeholder = "Search articles...", className = "" }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm.trim());
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Real-time search as user types
    onSearch(value.trim());
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className={`
        relative flex items-center bg-white rounded-xl border transition-all duration-200
        ${isFocused ? 'border-gray-400 shadow-sm' : 'border-gray-200'}
        hover:border-gray-300
      `}>
        <div className="absolute left-4 text-gray-400">
          <MagnifyingGlassIcon className="h-5 w-5" />
        </div>
        
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="
            w-full pl-12 pr-10 py-3 text-sm text-gray-900 placeholder-gray-500
            bg-transparent rounded-xl border-none outline-none
            focus:ring-0
          "
          aria-label="Search articles"
        />
        
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="
              absolute right-4 text-gray-400 hover:text-gray-600
              transition-colors p-1 rounded-full hover:bg-gray-100
            "
            aria-label="Clear search"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {/* Search suggestions or results count could go here */}
    </form>
  );
};

export default SearchBar;
