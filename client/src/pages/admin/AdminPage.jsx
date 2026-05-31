import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/store/slices/authSlice';
import { Button } from '@/components';

const AdminPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white gap-6">
      <h1 className="text-4xl font-bold">Admin Dashboard</h1>
      <Button 
        onClick={handleLogout}
        className="bg-orange-500 hover:bg-orange-600 text-white"
      >
        Logout
      </Button>
    </div>
  );
};

export default AdminPage;
