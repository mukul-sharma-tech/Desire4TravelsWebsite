import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { FiArrowLeft, FiCalendar, FiUser, FiChevronRight } from 'react-icons/fi';
import { Helmet } from 'react-helmet';
import './BlogPost.css';
import axios from 'axios';

const BlogPost = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [similarBlogs, setSimilarBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  //feedback form 
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    feedback: '',
    yourStory: ''
  });

  const [submitted, setSubmitted] = useState(false);
  // const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:3000/blog-feedback', formData);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    }
  };
  


  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`http://localhost:3000/blogs/${id}`);
        if (!res.ok) throw new Error('Blog not found');
        const data = await res.json();
        setBlog(data);

        const simRes = await fetch(`http://localhost:3000/blogs`);
        const allBlogs = await simRes.json();
        const filtered = allBlogs
          .filter(b => b.category === data.category && b.id !== id)
          .slice(0, 3);
        setSimilarBlogs(filtered);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) return (
    <div className="loading-container">
      <Helmet>
        <title>Loading... | Your Blog Name</title>
      </Helmet>
      <div className="loading-spinner"></div>
      <p>Loading blog post...</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <Helmet>
        <title>Error | Your Blog Name</title>
      </Helmet>
      <div className="error-icon">!</div>
      <h3>Error Loading Content</h3>
      <p>{error}</p>
      <Link to="/blogs" className="error-back-btn">
        <FiArrowLeft /> Back to Blogs
      </Link>
    </div>
  );

  if (!blog) return (
    <div className="not-found-container">
      <Helmet>
        <title>Not Found | Your Blog Name</title>
      </Helmet>
      <h3>Blog Post Not Found</h3>
      <p>The requested blog post doesn't exist or may have been removed.</p>
      <Link to="/blogs" className="not-found-btn">
        <FiArrowLeft /> Browse All Blogs
      </Link>
    </div>
  );

  const sanitizedContent = DOMPurify.sanitize(blog.content);
  const cleanExcerpt = blog.excerpt.replace(/<[^>]+>/g, '').slice(0, 160);

  return (
    <div className="blog-page-wrapper">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{`${blog.title} | Your Blog Name`}</title>
        <meta name="description" content={cleanExcerpt} />

        {/* Canonical URL */}
        <link rel="canonical" href={`http://localhost:3000/blogs/${id}`} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={cleanExcerpt} />
        <meta property="og:image" content={`http://localhost:3000${blog.image}`} />
        <meta property="og:url" content={`http://localhost:3000/blogs/${id}`} />
        <meta property="og:site_name" content="Your Blog Name" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.title} />
        <meta name="twitter:description" content={cleanExcerpt} />
        <meta name="twitter:image" content={`http://localhost:3000${blog.image}`} />

        {/* Article Specific */}
        <meta property="article:published_time" content={new Date(blog.date).toISOString()} />
        <meta property="article:author" content={blog.author} />
        <meta property="article:section" content={blog.category} />
      </Helmet>

      {/* Left Suggestions - Desktop Only */}
      <div className="side-suggestions left">
        <h3 className="suggestions-title">Similar Reads</h3>
        {similarBlogs.map((b, index) => (
          <Link to={`/blogs/${b.id}`} key={index} className="suggestion-card">
            <div className="suggestion-image-container">
              <img
                src={`http://localhost:3000${b.image}`}
                alt={b.alt}
                loading="lazy"
              />
            </div>
            <div className="suggestion-info">
              <h4>{b.title}</h4>
              <p>{b.excerpt.slice(0, 60)}...</p>
              <span className="read-more">Read More <FiChevronRight /></span>
            </div>
          </Link>
        ))}
      </div>

      {/* Main Blog Content */}
      <div className="blog-post-container">
        <div className="floating-decoration deco-1"></div>
        <div className="floating-decoration deco-2"></div>

        <article className="blog-post" itemScope itemType="https://schema.org/BlogPosting">
          <header className="blog-post-header">
            <span className="blog-category" itemProp="articleSection">{blog.category}</span>
            <h1 className="blog-title" itemProp="headline">{blog.title}</h1>
            <div className="blog-meta">
              <span className="blog-author" itemProp="author">
                <FiUser /> {blog.author}
              </span>
              <span className="blog-date" itemProp="datePublished">
                <FiCalendar /> {new Date(blog.date).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}
              </span>
            </div>
          </header>

          <div className="blog-image-box">
            <img
              src={`http://localhost:3000${blog.image}`}
              alt={blog.alt}
              className="blog-featured-image"
              itemProp="image"
              loading="eager"
            />
          </div>

          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            itemProp="articleBody"
          />

          <footer className="blog-footer">
            <Link to="/blogs" className="back-to-blogs">
              <FiArrowLeft /> Back to all blogs
            </Link>
          </footer>
        </article>
      </div>

    <div className="side-suggestions right">
      <h3 className="form-title">Share Your Story</h3>

      {submitted ? (
        <div className="success-box">
          <div className="checkmark-wrapper">
            <svg className="checkmark" viewBox="0 0 52 52">
              <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
              <path className="checkmark-check" fill="none" d="M14 27l8 8 16-16" />
            </svg>
          </div>
          <p className="success-message">Thank you for your feedback!</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="feedback-form">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="number"
            placeholder="Phone Number"
            value={formData.number}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="feedback"
            placeholder="Short Feedback"
            value={formData.feedback}
            onChange={handleChange}
            required
          />
          <textarea
            name="yourStory"
            placeholder="Tell us your story..."
            value={formData.yourStory}
            onChange={handleChange}
            rows="5"
            required
          />
          <button type="submit" className="submit-button">Submit</button>
          {error && <p className="error-message">{error}</p>}
        </form>
      )}
    </div>


      {/* Mobile Suggestions */}
      <div className="mobile-suggestions">
        <h3>Related Articles</h3>
        <div className="mobile-suggestions-grid">
          {similarBlogs.map((b, index) => (
            <Link to={`/blogs/${b.id}`} key={index} className="mobile-suggestion-card">
              <div className="mobile-suggestion-image">
                <img
                  src={`http://localhost:3000${b.image}`}
                  alt={b.alt}
                  loading="lazy"
                />
              </div>
              <div className="mobile-suggestion-info">
                <h4>{b.title}</h4>
                <p>{b.excerpt.slice(0, 80)}...</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Sticky Call & WhatsApp Buttons */}
      <div className='sticky-buttons-container'>
        <a href="tel:+1234567890" className="sticky-button" target="_blank" rel="noopener noreferrer">
          📞 Call
        </a>
        <a href="https://wa.me/1234567890" className="sticky-button" target="_blank" rel="noopener noreferrer">
          💬 WhatsApp
        </a>
      </div>
    </div>
  );
};

export default BlogPost;