import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './BlogList.css';
import axios from 'axios';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage] = useState(6); // Number of blogs per page
  const [isModalOpen, setIsModalOpen] = useState(false);




////////

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


////////


  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('http://localhost:3000/blogs');
        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }
        const data = await response.json();
        setBlogs(data);
        setFilteredBlogs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchBlogs();
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let result = blogs;
    
    if (selectedCategory !== 'all') {
      result = result.filter(blog => 
        blog.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(blog => 
        blog.title.toLowerCase().includes(term) || 
        blog.author.toLowerCase().includes(term) ||
        blog.excerpt.toLowerCase().includes(term)
      );
    }
    
    setFilteredBlogs(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, selectedCategory, blogs]);

  // Get current blogs for pagination
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const categories = ['all', ...new Set(blogs.map(blog => blog.category.toLowerCase()))];

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading blogs...</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <p>Error: {error}</p>
      <button onClick={() => window.location.reload()} className="retry-button">
        Retry
      </button>
    </div>
  );

  return (
    <div className="blog-list-container">
      {/* Full-width Hero Section */}
      <header className="blog-hero">
        <div className="hero-content">
          <h1>Desi4Travels Stories</h1>
          <p>Discover inspiring travel stories, expert tips, and breathtaking destinations from around the globe.</p>
        <button className="btn-primary share" onClick={() => setIsModalOpen(true)}>
          Share Your Story
        </button>
        </div>
      </header>
      
      <div className="blog-content-container">
        <div className="search-filter-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="clear-search"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
          
          <div className="category-filter">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
            <div className="select-arrow">▼</div>
          </div>
        </div>
        
        <div className="results-count">
          Showing {filteredBlogs.length} {filteredBlogs.length === 1 ? 'post' : 'posts'}
          {filteredBlogs.length !== blogs.length && ' (filtered)'}
        </div>
        
        <div className="blog-grid">
          {currentBlogs.length > 0 ? (
            currentBlogs.map((blog, index) => (
              <BlogCard key={blog.id} blog={blog} index={index} />
            ))
          ) : (
            <div className="no-results">
              <img src="/images/no-results.svg" alt="No results" className="no-results-img" />
              <h3>No matching posts found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="pagination-button"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
              <button
                key={number}
                onClick={() => setCurrentPage(number)}
                className={`pagination-button ${currentPage === number ? 'active' : ''}`}
              >
                {number}
              </button>
            ))}
            
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="pagination-button"
            >
              Next
            </button>
          </div>
        )}
      </div>
      
      {/* Sticky Call & WhatsApp Buttons */}
      <div className='sticky-buttons-container'>
        <a href="tel:+91 79770 22583" className="sticky-button" target="_blank" rel="noopener noreferrer">
          📞 Call
        </a>
        {/* <a href="https://wa.me/1234567890" className="sticky-button" target="_blank" rel="noopener noreferrer">
          💬 WhatsApp
        </a> */}
      </div>

{isModalOpen && (
  <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <button className="modal-close" onClick={() => setIsModalOpen(false)}>×</button>
      <h2 className="modal-title">Share Your Story</h2>
      
      {submitted ? (
        <div className="success-box">
          <svg className="checkmark" viewBox="0 0 52 52">
            <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
            <path className="checkmark-check" fill="none" d="M14 27l8 8 16-16" />
          </svg>
          <p className="success-message">Thank you for your story!</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="modal-form">
          <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
          <input type="tel" name="number" placeholder="Phone Number" value={formData.number} onChange={handleChange} required />
          <input type="text" name="feedback" placeholder="Short Feedback" value={formData.feedback} onChange={handleChange} required />
          <textarea name="yourStory" placeholder="Tell us your story..." rows="5" value={formData.yourStory} onChange={handleChange} required></textarea>
          <button type="submit" className="submit-button">Submit</button>
          {error && <p className="error-message">{error}</p>}
        </form>
      )}
    </div>
  </div>
)}

      
    </div>
  );
};

const BlogCard = ({ blog, index }) => {
  return (
    <div 
      className="blog-card"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <Link to={`/blogs/${blog.id}`} className="blog-link">
        <div className="blog-image-container">
          <img 
            src={`http://localhost:3000${blog.image}`} 
            alt={blog.alt} 
            className="blog-image"
            loading="lazy"
          />
          <div className="image-overlay"></div>
          <span className="blog-category-badge">{blog.category}</span>
        </div>
        <div className="blog-content">
          <h2 className="blog-title">{blog.title}</h2>
          <p className="blog-excerpt">{blog.excerpt}</p>
          <div className="blog-meta">
            <span className="blog-author">
              <svg className="author-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              {blog.author}
            </span>
            <span className="blog-date">
              <svg className="date-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              {new Date(blog.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BlogList;


// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import './BlogList.css';

// const BlogList = () => {
//   const [blogs, setBlogs] = useState([]);
//   const [filteredBlogs, setFilteredBlogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('all');

//   useEffect(() => {
//     const fetchBlogs = async () => {
//       try {
//         const response = await fetch('http://localhost:3000/blogs');
//         if (!response.ok) {
//           throw new Error('Failed to fetch blogs');
//         }
//         const data = await response.json();
//         setBlogs(data);
//         setFilteredBlogs(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     // Simulate loading delay for better UX
//     const timer = setTimeout(() => {
//       fetchBlogs();
//     }, 800);

//     return () => clearTimeout(timer);
//   }, []);

//   useEffect(() => {
//     let result = blogs;
    
//     if (selectedCategory !== 'all') {
//       result = result.filter(blog => 
//         blog.category.toLowerCase() === selectedCategory.toLowerCase()
//       );
//     }
    
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       result = result.filter(blog => 
//         blog.title.toLowerCase().includes(term) || 
//         blog.author.toLowerCase().includes(term) ||
//         blog.excerpt.toLowerCase().includes(term)
//       );
//     }
    
//     setFilteredBlogs(result);
//   }, [searchTerm, selectedCategory, blogs]);

//   const categories = ['all', ...new Set(blogs.map(blog => blog.category.toLowerCase()))];

//   if (loading) return (
//     <div className="loading-container">
//       <div className="spinner"></div>
//       <p>Loading blogs...</p>
//     </div>
//   );

//   if (error) return (
//     <div className="error-container">
//       <div className="error-icon">⚠️</div>
//       <p>Error: {error}</p>
//       <button onClick={() => window.location.reload()} className="retry-button">
//         Retry
//       </button>
//     </div>
//   );

//   return (
//     <div className="blog-container">
//        {/* Hero Section */}
//        <header className="blog-header">
//          <h1>Desi4Travels Stories</h1>
//          <p>Discover inspiring travel stories, expert tips, and breathtaking destinations from around the globe.</p>
//          <button className="btn-primary share" onClick={() => setShowForm(true)}>
//            Share Your Story
//          </button>
//        </header>
      
//       <div className="search-filter-container">
//         <div className="search-box">
//           <input
//             type="text"
//             placeholder="Search blogs..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="search-input"
//           />
//           {searchTerm && (
//             <button 
//               onClick={() => setSearchTerm('')} 
//               className="clear-search"
//               aria-label="Clear search"
//             >
//               ×
//             </button>
//           )}
//         </div>
        
//         <div className="category-filter">
//           <select
//             value={selectedCategory}
//             onChange={(e) => setSelectedCategory(e.target.value)}
//             className="category-select"
//           >
//             {categories.map(category => (
//               <option key={category} value={category}>
//                 {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
//               </option>
//             ))}
//           </select>
//           <div className="select-arrow">▼</div>
//         </div>
//       </div>
      
//       <div className="results-count">
//         Showing {filteredBlogs.length} {filteredBlogs.length === 1 ? 'post' : 'posts'}
//       </div>
      
//       <div className="blog-grid">
//         {filteredBlogs.length > 0 ? (
//           filteredBlogs.map((blog, index) => (
//             <BlogCard key={blog.id} blog={blog} index={index} />
//           ))
//         ) : (
//           <div className="no-results">
//             <img src="/images/no-results.svg" alt="No results" className="no-results-img" />
//             <h3>No matching posts found</h3>
//             <p>Try adjusting your search or filter criteria</p>
//           </div>
//         )}
//       </div>
      
//       {/* Sticky Call & WhatsApp Buttons */}
//       <div className='sticky-buttons-container'>
//         <a href="tel:+1234567890" className="sticky-button" target="_blank" rel="noopener noreferrer">
//           📞 Call
//         </a>
//         <a href="https://wa.me/1234567890" className="sticky-button" target="_blank" rel="noopener noreferrer">
//           💬 WhatsApp
//         </a>
//       </div>
//     </div>
//   );
// };

// const BlogCard = ({ blog, index }) => {
//   return (
//     <div 
//       className="blog-card"
//       style={{ animationDelay: `${index * 0.1}s` }}
//     >
//       <Link to={`/blogs/${blog.id}`} className="blog-link">
//         <div className="blog-image-container">
//           <img 
//             src={`http://localhost:3000${blog.image}`} 
//             alt={blog.alt} 
//             className="blog-image"
//             loading="lazy"
//           />
//           <div className="image-overlay"></div>
//         </div>
//         <div className="blog-content">
//           <span className="blog-category">{blog.category}</span>
//           <h2 className="blog-title">{blog.title}</h2>
//           <p className="blog-excerpt">{blog.excerpt}</p>
//           <div className="blog-meta">
//             <span className="blog-author">
//               <span className="author-icon">👤</span> {blog.author}
//             </span>
//             <span className="blog-date">
//               <span className="date-icon">📅</span> {new Date(blog.date).toLocaleDateString('en-US', { 
//                 year: 'numeric', 
//                 month: 'short', 
//                 day: 'numeric' 
//               })}
//             </span>
//           </div>
//         </div>
//       </Link>
//     </div>
//   );
// };

// export default BlogList;





// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import './BlogList.css';

// const BlogPage = () => {
//   // State management
//   const [blogs, setBlogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeCategory, setActiveCategory] = useState('all');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showForm, setShowForm] = useState(false);
//   const [newBlog, setNewBlog] = useState({
//     title: '',
//     category: 'adventure',
//     image: '',
//     content: '',
//     author: ''
//   });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const blogsPerPage = 6;

//   // Initial blog data (fallback if API fails)
//   const initialBlogs = [
//     {
//       id: 1,
//       category: "adventure",
//       image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
//       title: "Trekking Through Patagonia's Untamed Wilderness",
//       excerpt: "Our 14-day journey through Torres del Paine National Park tested our limits but rewarded us with some of the most breathtaking landscapes on Earth...",
//       author: "Sarah Johnson",
//       date: "May 15, 2023"
//     },
//     {
//       id: 2,
//       category: "culture",
//       image: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
//       title: "A Month in Kyoto: Discovering Japan's Ancient Heart",
//       excerpt: "From tea ceremonies to temple stays, our deep dive into Kyoto's traditional culture changed our perspective on modern Japan...",
//       author: "Michael Chen",
//       date: "April 2, 2023"
//     },
//     {
//       id: 3,
//       category: "food",
//       image: "https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
//       title: "Eating Our Way Through Sicily: A Food Lover's Guide",
//       excerpt: "From street food markets to family-run trattorias, Sicily offers some of Italy's most vibrant and authentic culinary experiences...",
//       author: "Elena Rodriguez",
//       date: "March 18, 2023"
//     },
//     {
//       id: 4,
//       category: "tips",
//       image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
//       title: "The Ultimate Packing List for Long-Term Travel",
//       excerpt: "After 18 months on the road, we've perfected our packing strategy. Here's everything you need (and what you can leave behind)...",
//       author: "David & Priya",
//       date: "February 28, 2023"
//     },
//     {
//       id: 5,
//       category: "destinations",
//       image: "https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
//       title: "Hidden Gems: Thailand's Lesser-Known Islands",
//       excerpt: "Skip the crowds of Phuket and discover these 5 stunning Thai islands where you can still find secluded beaches and authentic local experiences...",
//       author: "Liam Nguyen",
//       date: "January 12, 2023"
//     },
//     {
//       id: 6,
//       category: "adventure",
//       image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
//       title: "Mountain Biking the Swiss Alps: Trail Guide",
//       excerpt: "We spent a summer exploring Switzerland's best mountain bike trails. Here are our top picks for all skill levels, plus essential tips...",
//       author: "Olivia Schmidt",
//       date: "December 5, 2022"
//     }
//   ];

//   // Fetch blogs from API or use initial data
//   useEffect(() => {
//     const fetchBlogs = async () => {
//       try {
//         const response = await fetch('http://localhost:3000/blogs');
//         if (!response.ok) {
//           throw new Error('Failed to fetch blogs');
//         }
//         const data = await response.json();
//         setBlogs(data);
//       } catch (err) {
//         console.error('Using fallback data due to:', err.message);
//         setBlogs(initialBlogs);
//         setError('Failed to load latest blogs. Showing sample data.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     const timer = setTimeout(() => {
//       fetchBlogs();
//     }, 800);

//     return () => clearTimeout(timer);
//   }, []);

//   // Disable body scroll when modal is open
//   useEffect(() => {
//     if (showForm) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'auto';
//     }
//   }, [showForm]);

//   // Filter blogs by category and search term
//   const filteredBlogs = blogs.filter(blog => {
//     const matchesCategory = activeCategory === 'all' || 
//                           blog.category.toLowerCase() === activeCategory.toLowerCase();
//     const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
//                          blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          blog.author.toLowerCase().includes(searchTerm.toLowerCase());
//     return matchesCategory && matchesSearch;
//   });

//   // Pagination logic
//   const indexOfLastBlog = currentPage * blogsPerPage;
//   const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
//   const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
//   const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

//   // Handle form input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewBlog(prev => ({ ...prev, [name]: value }));
//   };

//   // Handle blog submission
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const submittedBlog = {
//       id: blogs.length + 1,
//       title: newBlog.title,
//       category: newBlog.category,
//       image: newBlog.image,
//       excerpt: newBlog.content.substring(0, 100) + '...',
//       author: newBlog.author,
//       date: new Date().toLocaleDateString('en-US', { 
//         year: 'numeric', 
//         month: 'long', 
//         day: 'numeric' 
//       })
//     };
    
//     setBlogs([submittedBlog, ...blogs]);
//     setNewBlog({
//       title: '',
//       category: 'adventure',
//       image: '',
//       content: '',
//       author: ''
//     });
    
//     // Show success animation
//     setShowSuccess(true);
    
//     // Hide form and success animation after delay
//     setTimeout(() => {
//       setShowForm(false);
//       setTimeout(() => setShowSuccess(false), 300);
//     }, 1500);
//   };

//   // Handle page change
//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   // Get unique categories
//   const categories = ['all', ...new Set(blogs.map(blog => blog.category.toLowerCase()))];

//   if (loading) return (
//     <div className="loading-container">
//       <div className="spinner"></div>
//       <p>Loading blogs...</p>
//     </div>
//   );

//   if (error) return (
//     <div className="error-container">
//       <div className="error-icon">⚠️</div>
//       <p>{error}</p>
//       <button onClick={() => window.location.reload()} className="retry-button">
//         Retry
//       </button>
//     </div>
//   );

//   return (
//     <div className="travel-blog">
//       {/* Hero Section */}
//       <header className="blog-header">
//         <h1>Desi4Travels Stories</h1>
//         <p>Discover inspiring travel stories, expert tips, and breathtaking destinations from around the globe.</p>
//         <button className="btn-primary share" onClick={() => setShowForm(true)}>
//           Share Your Story
//         </button>
//       </header>

//       {/* Filter/Search Bar */}
//       <div className="blog-filter">
//         <div className="filter-container">
//           <div className="search-box">
//             <input
//               type="text"
//               placeholder="Search blog posts..."
//               value={searchTerm}
//               onChange={(e) => {
//                 setSearchTerm(e.target.value);
//                 setCurrentPage(1);
//               }}
//             />
//             {searchTerm && (
//               <button 
//                 onClick={() => setSearchTerm('')} 
//                 className="clear-search"
//                 aria-label="Clear search"
//               >
//                 ×
//               </button>
//             )}
//           </div>
//           <div className="category-filter">
//             <select
//               value={activeCategory}
//               onChange={(e) => {
//                 setActiveCategory(e.target.value);
//                 setCurrentPage(1);
//               }}
//               className="category-select"
//             >
//               {categories.map(category => (
//                 <option key={category} value={category}>
//                   {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
//                 </option>
//               ))}
//             </select>
//             <div className="select-arrow">▼</div>
//           </div>
//         </div>
//       </div>

//       {/* Results count */}
//       <div className="results-count">
//         Showing {filteredBlogs.length} {filteredBlogs.length === 1 ? 'post' : 'posts'}
//       </div>

//       {/* Blog Grid */}
//       <section className="blog-container">
//         <div className="blog-grid">
//           {currentBlogs.length > 0 ? (
//             currentBlogs.map((blog, index) => (
//               <article 
//                 key={blog.id} 
//                 className="blog-card" 
//                 data-category={blog.category}
//                 style={{ animationDelay: `${index * 0.1}s` }}
//               >
//                 <Link to={`/blogs/${blog.id}`} className="blog-link">
//                   <div className="blog-image">
//                     <img 
//                       ssrc={`http://localhost:3000${blog.image}`} 
//                       alt={blog.title} 
//                       loading="lazy"
//                     />
//                     <div className="image-overlay"></div>
//                   </div>
//                   <div className="blog-content">
//                     <span className="blog-category">{blog.category}</span>
//                     <h3 className="blog-title">{blog.title}</h3>
//                     <p className="blog-excerpt">{blog.excerpt}</p>
//                     <div className="blog-meta">
//                       <span className="blog-author">
//                         <span className="author-icon">👤</span> {blog.author}
//                       </span>
//                       <span className="blog-date">
//                         <span className="date-icon">📅</span> {blog.date}
//                       </span>
//                     </div>
//                   </div>
//                 </Link>
//               </article>
//             ))
//           ) : (
//             <div className="no-results">
//               <img src="/images/no-results.svg" alt="No results" className="no-results-img" />
//               <h3>No matching posts found</h3>
//               <p>Try adjusting your search or filter criteria</p>
//             </div>
//           )}
//         </div>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="pagination">
//             <button 
//               onClick={() => paginate(Math.max(1, currentPage - 1))} 
//               disabled={currentPage === 1}
//             >
//               &laquo;
//             </button>
            
//             {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
//               <button
//                 key={number}
//                 onClick={() => paginate(number)}
//                 className={currentPage === number ? 'active' : ''}
//               >
//                 {number}
//               </button>
//             ))}
            
//             <button 
//               onClick={() => paginate(Math.min(totalPages, currentPage + 1))} 
//               disabled={currentPage === totalPages}
//             >
//               &raquo;
//             </button>
//           </div>
//         )}
//       </section>

//       {/* Blog Submission Modal */}
//       {showForm && (
//         <div className="modal-overlay">
//           <div className={`modal-content ${showSuccess ? 'success' : ''}`}>
//             {!showSuccess ? (
//               <>
//                 <div className="modal-header">
//                   <h2>Share Your Travel Story</h2>
//                   <button className="close-btn" onClick={() => setShowForm(false)}>×</button>
//                 </div>
                
//                 <form onSubmit={handleSubmit}>
//                   <div className="form-group">
//                     <label htmlFor="blog-title">Title*</label>
//                     <input
//                       type="text"
//                       id="blog-title"
//                       name="title"
//                       value={newBlog.title}
//                       onChange={handleInputChange}
//                       required
//                       placeholder="Your blog post title"
//                     />
//                   </div>
                  
//                   <div className="form-group">
//                     <label htmlFor="blog-category">Category*</label>
//                     <select
//                       id="blog-category"
//                       name="category"
//                       value={newBlog.category}
//                       onChange={handleInputChange}
//                       required
//                     >
//                       <option value="adventure">Adventure</option>
//                       <option value="culture">Culture</option>
//                       <option value="food">Food</option>
//                       <option value="tips">Travel Tips</option>
//                       <option value="destinations">Destinations</option>
//                     </select>
//                   </div>
                  
//                   <div className="form-group">
//                     <label htmlFor="blog-image">Cover Image URL*</label>
//                     <input
//                       type="url"
//                       id="blog-image"
//                       name="image"
//                       value={newBlog.image}
//                       onChange={handleInputChange}
//                       placeholder="Paste image link (e.g., from Imgur)"
//                       required
//                     />
//                     <small>Use services like Imgur or Unsplash to host your image</small>
//                   </div>
                  
//                   <div className="form-group">
//                     <label htmlFor="blog-content">Your Story*</label>
//                     <textarea
//                       id="blog-content"
//                       name="content"
//                       value={newBlog.content}
//                       onChange={handleInputChange}
//                       rows="8"
//                       required
//                       placeholder="Share your travel experience in detail..."
//                     />
//                   </div>
                  
//                   <div className="form-group">
//                     <label htmlFor="author-name">Your Name*</label>
//                     <input
//                       type="text"
//                       id="author-name"
//                       name="author"
//                       value={newBlog.author}
//                       onChange={handleInputChange}
//                       required
//                       placeholder="How should we credit you?"
//                     />
//                   </div>
                  
//                   <button type="submit" className="btn-submit">
//                     Submit for Review
//                   </button>
//                 </form>
//               </>
//             ) : (
//               <div className="success-animation">
//                 <div className="checkmark">✓</div>
//                 <h3>Submitted Successfully!</h3>
//                 <p>Your travel story has been received.</p>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Sticky Call & WhatsApp Buttons */}
//       <div className='sticky-buttons-container'>
//         <a href="tel:+1234567890" className="sticky-button" target="_blank" rel="noopener noreferrer">
//           📞 Call
//         </a>
//         <a href="https://wa.me/1234567890" className="sticky-button" target="_blank" rel="noopener noreferrer">
//           💬 WhatsApp
//         </a>
//       </div>
//     </div>
//   );
// };

// export default BlogPage;