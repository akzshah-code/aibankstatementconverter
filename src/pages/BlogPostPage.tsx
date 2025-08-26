import Header from '../components/Header';
import Footer from '../components/Footer';
import { User, BlogPost } from '../lib/types';

interface BlogPostPageProps {
  posts: BlogPost[];
  postId: string;
  user: User | null;
  onLogout: () => void;
}

const BlogPostPage = ({ posts, postId, user, onLogout }: BlogPostPageProps) => {
  const post = posts.find(p => p.id === postId);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header user={user} onLogout={onLogout} />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {post ? (
          <article className="max-w-3xl mx-auto">
            <header className="mb-8 text-center border-b pb-8">
              <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark leading-tight">{post.title}</h1>
              <p className="text-brand-gray mt-4">
                Published on {post.date} by {post.author}
              </p>
            </header>
            
            <div className="prose lg:prose-xl max-w-none text-brand-dark space-y-4">
                {/* Featured Image Placeholder */}
                <div className="h-80 bg-gray-200 rounded-lg flex items-center justify-center mb-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
              <p>{post.content}</p>
            </div>
             <div className="mt-12 pt-8 border-t">
                <a href="#blog" className="font-semibold text-brand-blue hover:underline">&larr; Back to Blog</a>
            </div>
          </article>
        ) : (
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold text-brand-dark">Post Not Found</h1>
            <p className="text-brand-gray mt-4">Sorry, we couldn't find the post you were looking for.</p>
            <a href="#blog" className="inline-block mt-8 bg-brand-blue text-white px-6 py-3 rounded-md font-semibold hover:bg-opacity-90">
              Return to Blog
            </a>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BlogPostPage;