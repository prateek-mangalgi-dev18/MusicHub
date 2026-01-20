import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await axios.get('https://musichub-admin-x6wd.onrender.com/admin/users', {
        withCredentials: true,
      });
      setUsers(res.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://musichub-admin-x6wd.onrender.com/admin/users/${id}`, {
        withCredentials: true,
      });
      setMessage('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      setMessage('Failed to delete user');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 border shadow rounded">
      <h2 className="text-xl font-bold mb-4">Manage Users</h2>
      {message && <p className="text-sm text-green-600 mb-4">{message}</p>}
      <ul className="space-y-4">
        {users.map((user) => (
          <li key={user._id} className="bg-gray-800 p-4 rounded flex justify-between items-center text-white">
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>
            <button
              onClick={() => handleDelete(user._id)}
              className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageUsers;
