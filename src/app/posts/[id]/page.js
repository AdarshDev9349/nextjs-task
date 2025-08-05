import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, CalendarDaysIcon, ClockIcon, TagIcon } from '@heroicons/react/24/outline';

// This would be your data fetching function
async function getPost(id) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/posts/${id}`, {
      cache: 'no-store', // For SSR, ensure fresh data
    });
    
    if (!res.ok) {
      return null;
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const post = await getPost(params.id);
  
  if (!post) {
    return {
      title: 'Post Not Found - Beyond UI',
    };
  }

  return {
    title: `${post.title} - Beyond UI`,
    description: post.excerpt,
    keywords: post.tags?.join(', ') || '',
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export default async function PostPage({ params }) {
  const post = await getPost(params.id);

  if (!post) {
    notFound();
  }

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <div className="max-w-4xl mx-auto px-8 py-4">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative">
        <div className="relative h-96 overflow-hidden">
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl mx-auto text-white">
            {/* Category and metadata */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                {post.category}
              </span>
              <div className="flex items-center text-sm opacity-90">
                <CalendarDaysIcon className="h-4 w-4 mr-1" />
                <span>{formatDate(post.date)}</span>
              </div>
              <div className="flex items-center text-sm opacity-90">
                <ClockIcon className="h-4 w-4 mr-1" />
                <span>{post.time}</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-5xl font-bold mb-4 leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl opacity-90 leading-relaxed max-w-3xl">
              {post.excerpt}
            </p>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <main className="max-w-4xl mx-auto px-8 py-16">
        {/* Author info */}
        <div className="flex items-center space-x-4 mb-12 pb-8 border-b border-gray-100">
          <img 
            src={post.authorAvatar} 
            alt={post.author}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{post.author}</h3>
            <p className="text-gray-600">Published on {formatDate(post.date)} • {post.time}</p>
          </div>
        </div>

        {/* Article content */}
        <article className="prose prose-lg prose-gray max-w-none">
          <div 
            dangerouslySetInnerHTML={{ 
              __html: post.content.replace(/\n/g, '<br/>').replace(/## /g, '<h2>').replace(/### /g, '<h3>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/- /g, '<li>').replace(/<li>/g, '<ul><li>').replace(/<\/li>(?!.*<li>)/g, '</li></ul>')
            }} 
          />
        </article>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-100">
            <div className="flex items-center gap-3 flex-wrap">
              <TagIcon className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">Tags:</span>
              {post.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors text-sm text-gray-700 rounded-full cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Call to action */}
        <div className="mt-16 pt-8 border-t border-gray-100 text-center">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Enjoyed this article?
          </h3>
          <p className="text-gray-600 mb-6">
            Discover more insights on design, development, and digital transformation.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            Read More Articles
          </Link>
        </div>
      </main>
    </div>
  );
}

// For static generation (optional)
export async function generateStaticParams() {
  // You could fetch all post IDs here for static generation
  // For now, we'll use dynamic rendering
  return [];
}
