import React from 'react';
import { Link } from 'react-router-dom';

const AdminNav = () => {
  return (
    <div className="fixed top-4 right-4 z-50">
      <Link 
        to="/admin/login"
        className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition-colors"
      >
        Admin
      </Link>
    </div>
  );
};

export default AdminNav;
