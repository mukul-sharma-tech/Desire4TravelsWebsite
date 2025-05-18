import { useState } from 'react';
import './ManageBlog.css';

const ManageBlog = () => {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        category: '',
        content: '',
        date: '',
        excerpt: '',
        status: '',
        image: null,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('title', formData.title);
        data.append('author', formData.author);
        data.append('category', formData.category);
        data.append('content', formData.content);
        data.append('date', formData.date);
        data.append('excerpt', formData.excerpt);
        data.append('status', formData.status);
        data.append('image', formData.image);

        fetch('http://localhost:5000/blogs', {
            method: 'POST',
            body: data,
        })
            .then((res) => res.json())
            .then((result) => {
                console.log('Success:', result);
                alert('Blog post added successfully!');
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Something went wrong.');
            });
    };

    return (
        <div>
            <h1>Add New Blog Post</h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="author"
                    placeholder="Author"
                    value={formData.author}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="content"
                    placeholder="Content of the blog post"
                    value={formData.content}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="date"
                    placeholder="Date (YYYY-MM-DD)"
                    value={formData.date}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="excerpt"
                    placeholder="Excerpt (short summary)"
                    value={formData.excerpt}
                    onChange={handleChange}
                    required
                />
                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Status</option>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                </select>
                <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    required
                />
                <button type="submit">Add Blog Post</button>
            </form>
        </div>
    );
};

export default ManageBlog;
