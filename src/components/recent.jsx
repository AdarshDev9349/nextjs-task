'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const fetchPosts = async () => {
  const response = await fetch('/api/posts');
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  return response.json();
};

const RecentPosts = ({ searchTerm = '' }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  if (error) {
    return (
      <section className="max-w-7xl mx-auto px-8 py-16 bg-gray-50">
        <div className="text-center text-red-600">
          <p>Failed to load posts. Please try again later.</p>
        </div>
      </section>
    );
  }
  const posts = data || [];
  const recentPosts = posts.filter(post => !post.featured).slice(0, 6);

  // Preload images when data is available
  useEffect(() => {
    if (recentPosts.length > 0) {
      recentPosts.forEach(post => {
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
  }, [recentPosts]);

  // Filter posts based on search term
  const filteredPosts = searchTerm 
    ? recentPosts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : recentPosts;

  return (
    <section className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">
            {searchTerm ? `Search Results (${filteredPosts.length})` : 'Recent Posts'}
          </h2>
          <Link 
            href="/posts" 
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            All Posts
          </Link>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-gray-200 h-48 w-full"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-gray-200 rounded-full mr-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-500">
              <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
              <p className="text-gray-500">
                {searchTerm 
                  ? `No posts match "${searchTerm}". Try searching with different keywords.`
                  : 'No recent posts available at the moment.'
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <Link key={post.id} href={`/posts/${post.id}`} className="group">
                <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">                  <div className="relative overflow-hidden h-48">
                    <Image 
                      src={post.image} 
                      alt={post.title} 
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-800">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-semibold text-lg text-gray-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2 flex-shrink-0">
                      {post.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center text-xs text-gray-500">                        <Image 
                          src={post.authorAvatar} 
                          alt={post.author}
                          width={24}
                          height={24}
                          className="rounded-full mr-2"
                        />
                        <span className="font-medium">{post.author}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {post.time}
                      </div>
                    </div>
                    
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {post.tags.slice(0, 2).map((tag, tagIndex) => (
                          <span 
                            key={tagIndex}
                            className="inline-flex items-center px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                        {post.tags.length > 2 && (
                          <span className="text-xs text-gray-400">
                            +{post.tags.length - 2} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        {searchTerm && filteredPosts.length > 0 && (
          <div className="mt-12 text-center">
            <Link 
              href="/posts"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Posts
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentPosts;
