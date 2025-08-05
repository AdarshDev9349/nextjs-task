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

// Function to process post data
async function processPost(post) {
  // Check if image is valid, otherwise use fallback
  const imageValid = await isImageValid(post.image);
  const processedImage = imageValid ? post.image : FALLBACK_IMAGE;
  
  // Generate realistic content for blog posts
  const content = `# ${post.title}

${post.description}

## Introduction

In today's rapidly evolving digital landscape, understanding the nuances of modern design and technology is crucial for creating exceptional user experiences. This comprehensive guide explores the key principles and methodologies that drive successful digital products.

## Key Concepts

### User-Centered Design
User-centered design puts the needs, wants, and limitations of the end users at the center of every design decision. This approach ensures that products are not only functional but also intuitive and enjoyable to use.

### Design Systems
A design system is a collection of reusable components, guided by clear standards, that can be assembled together to build any number of applications. It provides consistency and efficiency in the design process.

### Performance Optimization
Modern web applications must be fast and responsive. Performance optimization involves various techniques including code splitting, lazy loading, and efficient asset management.

## Best Practices

1. **Consistency**: Maintain consistent design patterns throughout your application
2. **Accessibility**: Ensure your design is usable by people with disabilities
3. **Responsive Design**: Create layouts that work well on all device sizes
4. **User Testing**: Regularly test your designs with real users

## Implementation Strategies

### Progressive Enhancement
Start with a basic, functional experience and progressively add more advanced features for users with modern browsers and devices.

### Mobile-First Design
Begin designing for mobile devices and then scale up to larger screens. This approach ensures your design works well on the most constrained devices.

### Iterative Development
Use an iterative approach to continuously improve your design based on user feedback and analytics data.

## Conclusion

Creating exceptional digital experiences requires a deep understanding of both design principles and user psychology. By following these guidelines and continuously learning from user feedback, designers can create products that truly serve their users' needs.

Remember that great design is not just about aesthetics—it's about solving real problems for real people in an elegant and efficient way.`;

  return {
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
    featured: Math.random() > 0.7 // 30% chance of being featured
  };
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
  
  // Return 2-4 random tags
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

export async function GET() {
  try {
    const response = await fetch(API_URL, {
      next: { revalidate: 300 } // Revalidate every 5 minutes
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    
    const posts = await response.json();
    
    // Process all posts in parallel
    const processedPosts = await Promise.all(
      posts.map(post => processPost(post))
    );
    
    return NextResponse.json(processedPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
