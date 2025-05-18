import { Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './Components/Navbar.jsx';
import Home from './pages/Home.jsx';
import ManagePackage from './pages/ManagePackage.jsx';
import ManageBlog from './pages/ManageBlog.jsx';``
import ManageDestination from './pages/ManageDestination.jsx';
import AdminEnquiries from './pages/AdminEnquiries.jsx';
import './App.css';
import NewsletterAdmin from './pages/NewsletterAdmin.jsx';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/managepackage" element={<ManagePackage />} />
        <Route path="/manageblog" element={<ManageBlog />} />
        <Route path="/managedestination" element={<ManageDestination />} />
        <Route path="/adminenquiries" element={<AdminEnquiries />} />
        <Route path="/newsletteradmin" element={<NewsletterAdmin />} />
      </Routes>
    </div>
  );
}

export default App;
