'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import SearchBar from './SearchBar';
import { useState, useEffect } from 'react';

const fetchPosts = async () => {
  const response = await fetch('/api/posts');
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  return response.json();
};

const Hero = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="text-center text-red-600">
          <p>Failed to load posts. Please try again later.</p>
        </div>
      </div>
    );
  }
  const posts = data || [];
  const featuredPost = posts.find(post => post.featured) || posts[0];
  const featuredPosts = posts.filter(post => post.featured && post.id !== featuredPost?.id).slice(0, 5);

  // Preload images when data is available
  useEffect(() => {
    if (posts.length > 0) {
      posts.slice(0, 6).forEach(post => {
        if (post.image) {
          const img = new window.Image();
          img.src = post.image;
        }
        if (post.authorAvatar) {
          const img = new window.Image();
          img.src = post.authorAvatar;
        }
      });
    }
  }, [posts]);

  // Filter featured posts based on search term
  const filteredFeaturedPosts = featuredPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (term) => {
    setSearchTerm(term);
    // Also update the global search term
    if (onSearch) {
      onSearch(term);
    }
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Search Bar */}
        <div className="mb-12 max-w-xl mx-auto">
          <SearchBar 
            onSearch={handleSearch}
            placeholder="Search articles, topics, or categories..."
            className="w-full"
          />
          {searchTerm && (
            <p className="mt-2 text-sm text-gray-600 text-center">
              {searchTerm ? `Showing results for "${searchTerm}"` : ''}
            </p>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Featured Article */}
          <div className="lg:w-2/3">
            {isLoading ? (
              <div className="animate-pulse">
                <div className="bg-gray-200 rounded-2xl h-96 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            ) : featuredPost ? (
              <Link href={`/posts/${featuredPost.id}`} className="block group">
                <article className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="relative h-96">                    <Image 
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 66vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    
                    <div className="absolute bottom-8 left-8 right-8 text-white">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                          {featuredPost.category}
                        </span>
                        <div className="flex items-center text-sm opacity-90">                          <Image 
                            src={featuredPost.authorAvatar} 
                            alt={featuredPost.author}
                            width={24}
                            height={24}
                            className="rounded-full mr-2"
                          />
                          <span>{featuredPost.author}</span>
                          <span className="mx-2">•</span>
                          <span>{featuredPost.time}</span>
                        </div>
                      </div>
                      
                      <h1 className="text-4xl font-bold mb-3 leading-tight group-hover:text-blue-100 transition-colors">
                        {featuredPost.title}
                      </h1>
                      
                      <p className="text-lg opacity-90 leading-relaxed line-clamp-2">
                        {featuredPost.excerpt}
                      </p>
                    </div>
                  </div>
                </article>
              </Link>
            ) : null}
          </div>

          {/* Featured Posts Sidebar */}
          <div className="lg:w-1/3">
            <div className="sticky top-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Other featured posts
              </h3>
              
              {isLoading ? (
                <div className="space-y-6">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="animate-pulse flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {(searchTerm ? filteredFeaturedPosts : featuredPosts).map((post, index) => (
                    <Link 
                      key={post.id} 
                      href={`/posts/${post.id}`}
                      className="group flex items-start space-x-4 hover:bg-gray-50 p-3 -m-3 rounded-xl transition-colors"
                    >                      <div className="relative overflow-hidden rounded-lg flex-shrink-0 w-16 h-16">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                          sizes="64px"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-3">
                          {post.title}
                        </h4>
                        <div className="mt-2 flex items-center text-xs text-gray-500">
                          <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                            {post.category}
                          </span>
                          <span className="ml-2">{post.time}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                  
                  {searchTerm && filteredFeaturedPosts.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p>No featured posts match your search.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
