import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="text-6xl font-bold text-gray-300 mb-4">404</div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Post Not Found</h1>          <p className="text-gray-600">
            Sorry, we couldn&apos;t find the blog post you&apos;re looking for. It may have been moved or deleted.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            href="/"
            className="inline-flex items-center px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Blog
          </Link>
          
          <div className="text-sm text-gray-500">
            <p>or try searching for something else</p>
          </div>
        </div>
      </div>
    </div>
  );
}
