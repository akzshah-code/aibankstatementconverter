
import type { FC } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { User, BlogPost } from '../lib/types';

interface BlogPageProps {
  posts: BlogPost[];
  user: User | null;
  onLogout: () => void;
}

const BlogPostCard: FC<{ post: BlogPost }> = ({ post }) => (
  <a href={`#blog/${post.id}`} className="block group bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
    <div className="h-48 bg-gray-200 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    </div>
    <div className="p-6">
      <h2 className="text-xl font-bold text-brand-dark group-hover:text-brand-blue transition-colors duration-300">{post.title}</h2>
      <p className="text-sm text-brand-gray mt-2">{post.date} &bull; by {post.author}</p>
      <p className="text-brand-dark mt-4">{post.excerpt}</p>
      <span className="inline-block mt-4 font-semibold text-brand-blue">
        Read More &rarr;
      </span>
    </div>
  </a>
);

const BlogPage = ({ posts, user, onLogout }: BlogPageProps) => {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header user={user} onLogout={onLogout} />
      <main className="flex-grow overflow-y-auto container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-brand-dark">Our Blog</h1>
            <p className="text-lg text-brand-gray mt-4 max-w-2xl mx-auto">Insights, tutorials, and updates from the BankConverts team.</p>
        </div>
        
        {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map(post => (
                    <BlogPostCard key={post.id} post={post} />
                ))}
            </div>
        ) : (
            <div className="text-center py-16">
                <h2 className="text-2xl font-semibold text-brand-dark">No Posts Yet</h2>
                <p className="text-brand-gray mt-2">Check back soon for new articles!</p>
            </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BlogPage;