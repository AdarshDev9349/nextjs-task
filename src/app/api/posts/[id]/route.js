import { NextResponse } from 'next/server';

const FALLBACK_IMAGE = 'https://picsum.photos/id/237/200/300';
const API_URL = 'https://6890c3b3944bf437b5973f9c.mockapi.io/blogs';

// Function to check if image URL is valid
async function isImageValid(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok && response.headers.get('content-type')?.startsWith('image/');
  } catch {
    return false;
  }
}

function generateAuthor() {
  const authors = [
    'Jennifer Taylor',
    'Ryan Anderson', 
    'Michael Chen',
    'Sarah Johnson',
    'David Wilson',
    'Emily Rodriguez',
    'James Thompson',
    'Lisa Park'
  ];
  return authors[Math.floor(Math.random() * authors.length)];
}

function generateCategory() {
  const categories = [
    'Design',
    'Technology',
    'Business',
    'UX Research',
    'Development',
    'Strategy',
    'Innovation',
    'User Experience'
  ];
  return categories[Math.floor(Math.random() * categories.length)];
}

function generateTags() {
  const allTags = [
    'UI Design',
    'UX Design',
    'Web Development',
    'Mobile Design',
    'User Research',
    'Design Systems',
    'Accessibility',
    'Performance',
    'React',
    'Next.js',
    'Tailwind CSS',
    'TypeScript'
  ];
  
  const numTags = Math.floor(Math.random() * 3) + 2;
  const shuffled = allTags.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numTags);
}

function generateRandomDate() {
  const start = new Date(2024, 0, 1);
  const end = new Date();
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
}

export async function GET(request, { params }) {
  const { id } = params;
  
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      next: { revalidate: 300 }
    });
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    const post = await response.json();
    
    // Check if image is valid, otherwise use fallback
    const imageValid = await isImageValid(post.image);
    const processedImage = imageValid ? post.image : FALLBACK_IMAGE;
      // Generate simple content for the blog post
    const content = `# ${post.title}

${post.description}

## Overview

This post explores key insights and practical approaches in modern design and development. Learn about best practices, implementation strategies, and real-world applications.

## Key Takeaways

- Understanding user needs and requirements
- Implementing efficient design systems
- Optimizing for performance and accessibility
- Creating responsive and intuitive interfaces

## Conclusion

Effective digital experiences combine thoughtful design with solid technical implementation. Focus on solving real problems for users while maintaining clean, maintainable code.`;

    const processedPost = {
      id: post.id,
      title: post.title,
      excerpt: post.description.length > 150 
        ? post.description.substring(0, 150) + '...' 
        : post.description,
      description: post.description,
      content,
      image: processedImage,
      author: generateAuthor(),
      authorAvatar: `https://i.pravatar.cc/200?img=${Math.floor(Math.random() * 50) + 1}`,
      time: `${Math.floor(Math.random() * 8) + 2} min read`,
      date: generateRandomDate(),
      category: generateCategory(),
      tags: generateTags(),
      featured: Math.random() > 0.7
    };
    
    return NextResponse.json(processedPost);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}
