import { useState, useEffect, FormEvent } from 'react';
import { BlogPost } from '../../lib/types';

interface EditBlogPostModalProps {
  post: BlogPost;
  onSave: (post: BlogPost) => void;
  onClose: () => void;
}

const EditBlogPostModal = ({ post, onSave, onClose }: EditBlogPostModalProps) => {
  const [formData, setFormData] = useState<BlogPost>(post);

  useEffect(() => {
    setFormData(post);
  }, [post]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-brand-dark">Edit Blog Post</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-purple focus:border-brand-purple"/>
          </div>
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700">Author</label>
            <input type="text" name="author" id="author" value={formData.author} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-purple focus:border-brand-purple"/>
          </div>
          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">Excerpt</label>
            <textarea name="excerpt" id="excerpt" value={formData.excerpt} onChange={handleChange} rows={4} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-purple focus:border-brand-purple"/>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-semibold hover:bg-gray-300">Cancel</button>
            <button type="submit" className="bg-brand-purple text-white px-4 py-2 rounded-md font-semibold hover:bg-opacity-90">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlogPostModal;