import { useState } from 'react';
import { BlogPost } from '../../lib/types';
import EditBlogPostModal from './EditBlogPostModal';
import AddBlogPostModal from './AddBlogPostModal';

interface BlogManagementProps {
    posts: BlogPost[];
    setPosts: React.Dispatch<React.SetStateAction<BlogPost[]>>;
}

const BlogManagement = ({ posts, setPosts }: BlogManagementProps) => {
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const handleSavePost = (updatedPost: BlogPost) => {
        setPosts(prevPosts => prevPosts.map(post => post.id === updatedPost.id ? updatedPost : post));
        setEditingPost(null);
    };

    const handleSaveNewPost = (newPostData: Omit<BlogPost, 'id' | 'date'>) => {
        const newPost: BlogPost = {
            ...newPostData,
            content: newPostData.excerpt, // Use excerpt as content for now
            id: `post_${Date.now()}`,
            date: new Date().toISOString().split('T')[0], // Set current date
        };
        setPosts(prevPosts => [newPost, ...prevPosts]);
        setIsAddModalOpen(false);
    };
    
    const handleDeletePost = (postId: string) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-brand-dark">Manage Blog Posts</h2>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-brand-blue text-white px-4 py-2 rounded-md font-semibold hover:bg-opacity-90 transition-colors duration-200"
                >
                    New Post
                </button>
            </div>
             <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm whitespace-nowrap">
                <thead className="border-b font-medium bg-gray-50">
                    <tr>
                    <th scope="col" className="px-6 py-3">Title</th>
                    <th scope="col" className="px-6 py-3">Author</th>
                    <th scope="col" className="px-6 py-3">Date</th>
                    <th scope="col" className="px-6 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map(post => (
                    <tr key={post.id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-semibold">{post.title}</td>
                        <td className="px-6 py-4">{post.author}</td>
                        <td className="px-6 py-4">{post.date}</td>
                        <td className="px-6 py-4 text-right space-x-4">
                         <button onClick={() => setEditingPost(post)} className="font-medium text-brand-blue hover:text-brand-blue/80">
                            Edit
                        </button>
                         <button onClick={() => handleDeletePost(post.id)} className="font-medium text-red-500 hover:text-red-500/80">
                            Delete
                        </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            {editingPost && <EditBlogPostModal post={editingPost} onSave={handleSavePost} onClose={() => setEditingPost(null)} />}
            {isAddModalOpen && <AddBlogPostModal onSave={handleSaveNewPost} onClose={() => setIsAddModalOpen(false)} />}
        </div>
    );
};

export default BlogManagement;