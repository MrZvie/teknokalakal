import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { withSwal } from 'react-sweetalert2';

const EditAdmin = ({ swal }) => {
  const router = useRouter();
  const { id } = router.query; // Get the admin ID from the URL query parameter to edit admin 

  const [admin, setAdmin] = useState(null);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('admin');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);  // State to track the saving process

  useEffect(() => {
    const fetchAdmin = async () => {
      if (id) {
        try {
          const response = await axios.get(`/api/admin/${id}`); // Fetch admin data from the API
          setAdmin(response.data);
          setName(response.data.name);
          setUsername(response.data.username);
          setEmail(response.data.email);
          setRole(response.data.role);
        } catch (err) {
          console.error('Error fetching admin data:', err);
        }
      }
    };

    fetchAdmin();
  }, [id]);

  const handleUpdateAdmin = async (e) => {
    e.preventDefault();
    if (!name || !username) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSaving(true);  // Set isSaving to true to disable the form

    try {
      const data = { name, username, role };
      await axios.put(`/api/admin/${id}`, data);
      swal.fire('Admin Updated', 'Admin details updated successfully!', 'success');
      router.push('/admin');
    } catch (error) {
      setError(error.response?.data.message || 'Error updating admin');
    } finally {
      setIsSaving(false);  // Reset isSaving after the process is complete
    }
  };

  const handleCancel = () => {
    router.push('/admin');
  };

  return (
    <Layout>
      <div className="flex items-center justify-center py-8">
        <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg border border-gray-300">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6">Edit Admin</h1>

          {admin ? (
            <form onSubmit={handleUpdateAdmin} className="space-y-6">
              {error && <div className="bg-red-100 text-red-700 p-4 rounded-md text-sm">{error}</div>}

              <div className="space-y-4">
                {/* Full Name Input */}
                <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className={`w-full border-2 border-gray-300 mb-0 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isSaving}
                  />
                </div>

                {/* Username Input */}
                <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  UserName
                </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className={`w-full border-2 border-gray-300 mb-0 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isSaving}
                  />
                </div>

                {/* Email Input (Disabled) */}
                <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                  <input
                    type="email"
                    value={email}
                    placeholder="Email"
                    disabled
                    className="w-full border-2 bg-gray-200 border-gray-300 mb-0 rounded-md px-4 py-2 text-sm text-gray-500 cursor-not-allowed"
                  />
                </div>

                {/* Role Selector */}
                <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700"
                >
                  Role
                </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className={`w-full border-2 border-gray-300 mb-0 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isSaving}
                  >
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </div>

                <div className="flex gap-4">
                  {/* Update Button */}
                  <button
                    type="submit"
                    className={`w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Update Admin'}  {/* Change button text while saving */}
                  </button>

                  {/* Cancel Button */}
                  <button
                    type="button"
                    onClick={handleCancel}
                    className={`w-full bg-gray-400 text-white py-2 rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 transition ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <p className="text-center text-gray-600">Loading admin details...</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default withSwal(({ swal }) => <EditAdmin swal={swal} />);
