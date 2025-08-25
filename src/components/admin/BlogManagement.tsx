import { useState } from 'react';
import { blogPosts } from '../../lib/mock-data';
import { BlogPost } from '../../lib/types';

const BlogManagement = () => {
    const [posts] = useState<BlogPost[]>(blogPosts);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-brand-dark">Manage Blog Posts</h2>
                <button className="bg-brand-purple text-white px-4 py-2 rounded-md font-semibold hover:bg-opacity-90 transition-colors duration-200">
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
                         <button className="font-medium text-brand-purple hover:text-brand-purple/80">
                            Edit
                        </button>
                         <button className="font-medium text-red-500 hover:text-red-500/80">
                            Delete
                        </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
        </div>
    );
};

export default BlogManagement;
