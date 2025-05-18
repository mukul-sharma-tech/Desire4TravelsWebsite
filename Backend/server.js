const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const serviceAccount = require('./firebaseAdminConfig.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
    cb(null, uniqueSuffix);
  }
});
const upload = multer({ storage });


app.post('/enquiry', async (req, res) => {
  try {
    const { name, phone, destination, travelers, travelDate } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required' });
    }

    const enquiry = {
      name,
      phone,
      destination,
      travelers,
      travelDate,
      submittedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('enquiries').add(enquiry);

    res.status(201).json({ message: 'Form submitted', id: docRef.id });
  } catch (error) {
    console.error('Error saving enquiry:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


app.get('/api/admin/enquiries', async (req, res) => {
  try {
    const snapshot = await db.collection('enquiries').orderBy('submittedAt', 'desc').get();
    const enquiries = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        submittedAt: data.submittedAt ? data.submittedAt.toDate().toISOString() : null
      };
    });

    res.status(200).json(enquiries);
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


app.post('/api/admin/destinations', upload.single('image'), async (req, res) => {
  try {
    const { name, state, type, rating } = req.body;

    if (!name || !state || !type || !rating || !req.file) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const parsedRating = parseFloat(rating);
    if (isNaN(parsedRating) || parsedRating < 0 || parsedRating > 5) {
      return res.status(400).json({ error: 'Rating must be between 0 and 5' });
    }

    const newDestination = {
      name,
      state,
      type,
      rating: parsedRating,
      image: req.file.filename,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('destinations').add(newDestination);
    res.status(201).json({ message: 'Destination added successfully', id: docRef.id });
  } catch (error) {
    console.error('Error adding destination:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/admin/destinations', async (req, res) => {
  try {
    const snapshot = await db.collection('destinations').get();
    const destinations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.status(200).json(destinations);
  } catch (error) {
    console.error('Error fetching destinations:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/admin/destinations/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, state, type, rating } = req.body;
    const destinationId = req.params.id;

    const destinationRef = db.collection('destinations').doc(destinationId);
    const doc = await destinationRef.get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Destination not found' });
    }

    const updates = {
      ...(name && { name }),
      ...(state && { state }),
      ...(type && { type }),
      ...(rating && { rating: parseFloat(rating) }),
    };

    if (req.file) {
      updates.image = req.file.filename;
    }

    await destinationRef.update(updates);
    res.status(200).json({ message: 'Destination updated successfully' });
  } catch (error) {
    console.error('Error updating destination:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/admin/destinations/:id', async (req, res) => {
  try {
    const destinationId = req.params.id;
    const destinationRef = db.collection('destinations').doc(destinationId);
    const doc = await destinationRef.get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Destination not found' });
    }

    await destinationRef.delete();
    res.status(200).json({ message: 'Destination deleted successfully' });
  } catch (error) {
    console.error('Error deleting destination:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/admin/packages', upload.single('photo'), async (req, res) => {
  try {
    const {
      packageName,
      duration,
      price,
      description,
      inclusions,
      itinerary,
      destinations
    } = req.body;

    if (!packageName || !duration || !price || !description || !inclusions || !itinerary || !req.file || !destinations) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const parsedDestinations = JSON.parse(destinations);
    if (!Array.isArray(parsedDestinations)) {
      return res.status(400).json({ error: 'Destinations must be an array' });
    }

    const newPackage = {
      packageName,
      duration,
      price,
      description,
      inclusions,
      itinerary,
      photo: req.file.filename,
      destinations: parsedDestinations,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection('packages').add(newPackage);
    res.status(201).json({ message: 'Package added successfully', id: docRef.id });
  } catch (error) {
    console.error('Error creating package:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/admin/packages', async (req, res) => {
  try {
    const snapshot = await db.collection('packages').orderBy('createdAt', 'desc').get();
    const packages = [];

    for (const doc of snapshot.docs) {
      const pkg = doc.data();
      const destIds = pkg.destinations || [];

      const destinationNames = [];
      for (const destId of destIds) {
        const destDoc = await db.collection('destinations').doc(destId).get();
        if (destDoc.exists) {
          const dest = destDoc.data();
          destinationNames.push(`${dest.name}-${dest.state}`);
        } else {
          destinationNames.push('Unknown');
        }
      }

      packages.push({
        id: doc.id,
        packageName: pkg.packageName,
        photo: `${req.protocol}://${req.get('host')}/uploads/${pkg.photo}`,
        price: pkg.price,
        duration: pkg.duration,
        description: pkg.description,
        inclusions: pkg.inclusions,
        itinerary: pkg.itinerary,
        destinations: destinationNames,
        createdAt: pkg.createdAt
      });
    }

    res.status(200).json(packages);
  } catch (error) {
    console.error('Error fetching admin packages:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/admin/packages/:id', upload.single('photo'), async (req, res) => {
  try {
    const packageId = req.params.id;
    const {
      packageName,
      duration,
      price,
      description,
      inclusions,
      itinerary,
      destinations
    } = req.body;

    const updateData = {
      ...(packageName && { packageName }),
      ...(duration && { duration }),
      ...(price && { price }),
      ...(description && { description }),
      ...(inclusions && { inclusions }),
      ...(itinerary && { itinerary }),
    };

    if (destinations) {
      try {
        const parsedDestinations = JSON.parse(destinations);
        if (!Array.isArray(parsedDestinations)) {
          return res.status(400).json({ error: 'Destinations must be an array' });
        }
        updateData.destinations = parsedDestinations;
      } catch (err) {
        return res.status(400).json({ error: 'Invalid JSON format for destinations' });
      }
    }

    if (req.file) {
      updateData.photo = req.file.filename;
    }

    await db.collection('packages').doc(packageId).update(updateData);

    res.status(200).json({ message: 'Package updated successfully' });
  } catch (error) {
    console.error('Error updating package:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/admin/packages/:id', async (req, res) => {
  try {
    const packageId = req.params.id;
    const doc = await db.collection('packages').doc(packageId).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Package not found' });
    }

    await db.collection('packages').doc(packageId).delete();
    res.status(200).json({ message: 'Package deleted successfully' });
  } catch (error) {
    console.error('Error deleting package:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/packages', async (req, res) => {
  try {
    const snapshot = await db.collection('packages').orderBy('createdAt', 'desc').get();
    const packages = [];

    for (const doc of snapshot.docs) {
      const pkg = doc.data();
      const destIds = pkg.destinations || [];

      const destinationNames = [];
      for (const destId of destIds) {
        const destDoc = await db.collection('destinations').doc(destId).get();
        if (destDoc.exists) {
          const dest = destDoc.data();
          destinationNames.push(`${dest.name}-${dest.state}`);
        }
      }

      packages.push({
        id: doc.id,
        packageName: pkg.packageName,
        photo: `${req.protocol}://${req.get('host')}/uploads/${pkg.photo}`,
        price: pkg.price,
        duration: pkg.duration,
        destinations: destinationNames,
      });
    }

    res.status(200).json(packages);
  } catch (error) {
    console.error('Error fetching client packages:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/packages/:id', async (req, res) => {
  try {
    const packageId = req.params.id;
    const packageDoc = await db.collection('packages').doc(packageId).get();

    if (!packageDoc.exists) {
      return res.status(404).json({ error: 'Package not found' });
    }

    const packageData = packageDoc.data();
    const fullDestinations = [];

    for (const destId of packageData.destinations || []) {
      const destDoc = await db.collection('destinations').doc(destId).get();
      if (destDoc.exists) {
        const destData = destDoc.data();
        fullDestinations.push({
          id: destDoc.id,
          ...destData,
          image: `${req.protocol}://${req.get('host')}/uploads/${destData.image}`,
        });
      }
    }

    const responseData = {
      ...packageData,
      photo: `${req.protocol}://${req.get('host')}/uploads/${packageData.photo}`,
      destinations: fullDestinations,
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error fetching package by ID:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/destinations', async (req, res) => {
  try {
    const { state, type, page = 1, limit = 100 } = req.query;
    const destinationsRef = db.collection('destinations');
    let query = destinationsRef;

    if (state) {
      query = query.where('state', '==', state);
    }

    if (type) {
      query = query.where('type', 'array-contains', type);
    }

    query = query.orderBy('createdAt', 'desc');

    const snapshot = await query.get();
    const allDestinations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const startIndex = (page - 1) * limit;
    const paginated = allDestinations.slice(startIndex, startIndex + Number(limit));
    const hasNextPage = allDestinations.length > startIndex + Number(limit);

    res.status(200).json({
      destinations: paginated,
      hasNextPage
    });
  } catch (error) {
    console.error('Error fetching destinations:', error);
    res.status(500).json({ error: 'Failed to fetch destinations' });
  }
});

app.post('/api/newsletter', async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email format
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    const existing = await db.collection('newsletter')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (!existing.empty) {
      return res.status(409).json({ error: 'Email already subscribed' });
    }

    await db.collection('newsletter').add({
      email,
      subscribedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).json({ message: 'Subscribed successfully' });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/admin/newsletter', async (req, res) => {
  try {
    const snapshot = await db.collection('newsletter').orderBy('subscribedAt', 'desc').get();
    const subscribers = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        email: data.email,
        subscribedAt: data.subscribedAt ? data.subscribedAt.toDate().toISOString() : null,
      };
    });

    res.status(200).json(subscribers);
  } catch (error) {
    console.error('Error fetching newsletter subscribers:', error);
    res.status(500).json({ error: 'Server error' });
  }
});






// BLOGS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//blogs crud
// app.post('/blogs', upload.single('image'), async (req, res) => {
//     try {
//         console.log('REQ BODY:', req.body);
//         console.log('REQ FILE:', req.file);

//         // Destructure the fields for blog post
//         const { title, author, category, content, date, excerpt, status, alt } = req.body;

//         // Check if all required fields are provided
//         if (!title || !author || !category || !content || !date || !excerpt || !alt || !status || !req.file) {
//             return res.status(400).json({ error: 'All fields are required.' });
//         }

//         // Upload image and get the URL
//         const imageUrl = `/uploads/${req.file.filename}`;

//         // Add blog post to Firestore
//         const docRef = await db.collection('blogs').add({
//             title,
//             author,
//             category,
//             content,
//             date,
//             excerpt,
//             status,
//             alt,
//             image: imageUrl,
//             createdAt: admin.firestore.FieldValue.serverTimestamp(),
//         });

//         console.log('BLOG POST ADDED: ', docRef.id);

//         // Respond with a success message and the ID of the added blog post
//         res.status(200).json({
//             message: 'Blog post added successfully',
//             id: docRef.id,
//         });
//     } catch (error) {
//         console.error('FIRESTORE ERROR:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// // GET all blogs
// app.get('/blogs', async (req, res) => {
//     try {
//         const snapshot = await db.collection('blogs').get();
//         const blogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         res.json(blogs);
//     } catch (error) {
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });


// // GET single blog
// app.get('/blogs/:id', async (req, res) => {
//     try {
//         const doc = await db.collection('blogs').doc(req.params.id).get();
//         if (!doc.exists) return res.status(404).json({ error: 'Blog not found' });
//         res.json({ id: doc.id, ...doc.data() });
//     } catch (error) {
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// // PUT update blog
// app.put('/blogs/:id', upload.single('image'), async (req, res) => {
//     try {
//         const updates = req.body;
//         if (req.file) {
//             updates.image = `/uploads/${req.file.filename}`;
//         }
//         await db.collection('blogs').doc(req.params.id).update(updates);
//         res.json({ message: 'Blog updated successfully' });
//     } catch (error) {
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });


// // DELETE blog
// app.delete('/blogs/:id', async (req, res) => {
//     try {
//         await db.collection('blogs').doc(req.params.id).delete();
//         res.json({ message: 'Blog deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

const slugify = (text) => {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
};

// CREATE blog
app.post('/blogs', upload.single('image'), async (req, res) => {
    try {
        console.log('REQ BODY:', req.body);
        console.log('REQ FILE:', req.file);

        const { title, author, category, content, date, excerpt, status, alt } = req.body;

        if (!title || !author || !category || !content || !date || !excerpt || !alt || !status || !req.file) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const imageUrl = `/uploads/${req.file.filename}`;
        const slug = slugify(title);
        
        const docRef = await db.collection('blogs').add({
            title,
            author,
            category,
            content,
            date,
            excerpt,
            status,
            alt,
            image: imageUrl,
            slug,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        res.status(201).json({
            message: 'Blog post added successfully',
            id: docRef.id,
            url: `/blogs/${docRef.id}-${slug}`
        });
    } catch (error) {
        console.error('FIRESTORE ERROR:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET all blogs
app.get('/blogs', async (req, res) => {
    try {
        const snapshot = await db.collection('blogs').get();
        const blogs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            url: `/blogs/${doc.id}-${doc.data().slug}`
        }));
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET single blog by ID or slug
app.get('/blogs/:identifier', async (req, res) => {
    try {
        const identifier = req.params.identifier;
        
        // If identifier is just an ID (no dashes)
        if (!identifier.includes('-')) {
            const doc = await db.collection('blogs').doc(identifier).get();
            if (!doc.exists) return res.status(404).json({ error: 'Blog not found' });
            
            // Redirect to SEO-friendly URL if possible
            if (doc.data().slug) {
                return res.redirect(301, `/blogs/${doc.id}-${doc.data().slug}`);
            }
            return res.json({ id: doc.id, ...doc.data() });
        }
        
        // Extract ID from slug (first part before first dash)
        const id = identifier.split('-')[0];
        const doc = await db.collection('blogs').doc(id).get();
        
        if (!doc.exists) return res.status(404).json({ error: 'Blog not found' });
        
        // Verify the full slug matches
        const expectedSlug = `${id}-${doc.data().slug}`;
        if (identifier !== expectedSlug) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        
        res.json({ 
            id: doc.id, 
            ...doc.data(),
            url: `/blogs/${expectedSlug}` 
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// UPDATE blog
app.put('/blogs/:id', upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        if (req.file) {
            updates.image = `/uploads/${req.file.filename}`;
        }
        
        // If title is being updated, update the slug too
        if (updates.title) {
            updates.slug = slugify(updates.title);
        }
        
        // Get current document to check if we need to redirect
        const currentDoc = await db.collection('blogs').doc(id).get();
        const currentSlug = currentDoc.data().slug;
        
        await db.collection('blogs').doc(id).update(updates);
        
        const newSlug = updates.slug || currentSlug;
        const newUrl = `/blogs/${id}-${newSlug}`;
        
        res.json({ 
            message: 'Blog updated successfully',
            id,
            url: newUrl,
            redirect: updates.slug ? newUrl : null // Only if slug changed
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE blog
app.delete('/blogs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.collection('blogs').doc(id).delete();
        res.json({ 
            message: 'Blog deleted successfully',
            id
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Utility function to create slugs
// const slugify = (text) => {
//   return text.toString().toLowerCase()
//     .replace(/\s+/g, '-')           // Replace spaces with -
//     .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
//     .replace(/\-\-+/g, '-')         // Replace multiple - with single -
//     .replace(/^-+/, '')             // Trim - from start of text
//     .replace(/-+$/, '');            // Trim - from end of text
// };

// // POST create blog
// app.post('/blogs', upload.single('image'), async (req, res) => {
//     try {
//         console.log('REQ BODY:', req.body);
//         console.log('REQ FILE:', req.file);

//         // Destructure the fields for blog post
//         const { title, author, category, content, date, excerpt, status, alt } = req.body;

//         // Check if all required fields are provided
//         if (!title || !author || !category || !content || !date || !excerpt || !alt || !status || !req.file) {
//             return res.status(400).json({ error: 'All fields are required.' });
//         }

//         // Upload image and get the URL
//         const imageUrl = `/uploads/${req.file.filename}`;

//         // Create slug from title
//         const slug = slugify(title);

//         // Add blog post to Firestore
//         const docRef = await db.collection('blogs').add({
//             title,
//             author,
//             category,
//             content,
//             date,
//             excerpt,
//             status,
//             alt,
//             image: imageUrl,
//             slug, // Add the slug field
//             createdAt: admin.firestore.FieldValue.serverTimestamp(),
//         });

//         console.log('BLOG POST ADDED: ', docRef.id);

//         // Respond with a success message and the ID of the added blog post
//         res.status(200).json({
//             message: 'Blog post added successfully',
//             id: docRef.id,
//             slug: slug
//         });
//     } catch (error) {
//         console.error('FIRESTORE ERROR:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// // GET all blogs
// app.get('/blogs', async (req, res) => {
//     try {
//         const snapshot = await db.collection('blogs').get();
//         const blogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         res.json(blogs);
//     } catch (error) {
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// // GET single blog by ID (for API calls)
// app.get('/blogs/:id', async (req, res) => {
//     try {
//         const doc = await db.collection('blogs').doc(req.params.id).get();
//         if (!doc.exists) return res.status(404).json({ error: 'Blog not found' });
//         res.json({ id: doc.id, ...doc.data() });
//     } catch (error) {
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// // GET single blog by slug (for SEO-friendly URLs)
// app.get('/blogs/:slug/:id', async (req, res) => {
//     try {
//         const doc = await db.collection('blogs').doc(req.params.id).get();
//         if (!doc.exists) return res.status(404).json({ error: 'Blog not found' });
        
//         const blogData = doc.data();
        
//         // Verify the slug matches
//         if (blogData.slug !== req.params.slug) {
//             // If slug doesn't match, redirect to correct URL
//             return res.redirect(301, `/blogs/${blogData.slug}/${req.params.id}`);
//         }
        
//         res.json({ id: doc.id, ...blogData });
//     } catch (error) {
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// // PUT update blog
// app.put('/blogs/:id', upload.single('image'), async (req, res) => {
//     try {
//         const updates = req.body;
//         if (req.file) {
//             updates.image = `/uploads/${req.file.filename}`;
//         }
        
//         // If title is being updated, update the slug too
//         if (updates.title) {
//             updates.slug = slugify(updates.title);
//         }
        
//         await db.collection('blogs').doc(req.params.id).update(updates);
//         res.json({ message: 'Blog updated successfully' });
//     } catch (error) {
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// // DELETE blog
// app.delete('/blogs/:id', async (req, res) => {
//     try {
//         await db.collection('blogs').doc(req.params.id).delete();
//         res.json({ message: 'Blog deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });





app.post('/contact', async (req, res) => {
    try {
        const { name, phoneNo, called = false } = req.body;

        // Validate inputs first
        if (!name || !phoneNo) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Save to Firestore
        await db.collection('contact').add({
            name,
            phoneNo,
            called,
            createdAt: admin.firestore.FieldValue.serverTimestamp() // optional but useful
        });

        res.status(200).json({ message: 'Contact request sent successfully' });

    } catch (error) {
        console.error('Error saving contact:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



// GET all contact requests
app.get('/contact', async (req, res) => {
    try {
        const snapshot = await db.collection('contact').get();
        const contactRequests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(contactRequests);
    }
    catch (error) {
        console.error('GET CONTACT REQUESTS ERROR:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
);

//get single contact
app.get('/contact/:id', async (req, res) =>
    {
        try {
            const id = req.params.id;
            const doc = await db.collection('contact').doc(id).get();
            if (!doc.exists) {
                return res.status(404).json({ error: 'Contact not found' });
            }
            res.json({ id: doc.id, ...doc.data() });
            } catch (error) {
                console.error('GET SINGLE CONTACT ERROR:', error);
                res.status(500).json({ error: 'Internal server error' });
                }
    }
);



app.put('/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { called } = req.body;

    // Validate input
    if (typeof called !== 'boolean') {
      return res.status(400).json({ error: "'called' must be a boolean value." });
    }

    // Update the document
    await db.collection('contact').doc(id).update({ called });

    res.json({ message: 'Contact updated successfully' });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});





//BLOG STORY FEEDBACK

// GET all feedbacks
app.get('/blog-feedback', async (req, res) => {
    try {
        const snapshot = await db.collection('feedbacks').get();
        const feedbacks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET single feedback
app.get('/blog-feedback/:id', async (req, res) => {
    try {
        const doc = await db.collection('feedbacks').doc(req.params.id).get();
        if (!doc.exists) return res.status(404).json({ error: 'Feedback not found' });
        res.json({ id: doc.id, ...doc.data() });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST create feedback
app.post('/blog-feedback', async (req, res) => {
    try {
        const { name, number, feedback, yourStory } = req.body;
        if (!name || !number || !feedback || !yourStory) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newDoc = await db.collection('feedbacks').add({
            name,
            number,
            feedback,
            yourStory,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        res.status(201).json({ id: newDoc.id });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT update feedback
app.put('/blog-feedback/:id', async (req, res) => {
    try {
        const { name, number, feedback, yourStory } = req.body;
        if (!name || !number || !feedback || !yourStory) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        await db.collection('feedbacks').doc(req.params.id).update({
            name,
            number,
            feedback,
            yourStory,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        res.json({ message: 'Feedback updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE feedback
app.delete('/blog-feedback/:id', async (req, res) => {
    try {
        await db.collection('feedbacks').doc(req.params.id).delete();
        res.json({ message: 'Feedback deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
