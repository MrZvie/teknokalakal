import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "@/components/Layout";
import { withSwal } from "react-sweetalert2";
import Link from "next/link";
import LoadingIndicator from "@/components/LoadingIndicator";

const AddAdmin = ({ swal }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [provider, setProvider] = useState("credentials");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [admins, setAdmins] = useState([]);
  const [roleFilter, setRoleFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingAdmins, setFetchingAdmins] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const nameUsernameRegex = /^[a-zA-Z\s]+$/;

  // Function to fetch users
  const fetchAdmins = async () => {
    setFetchingAdmins(true);
    try {
      const response = await axios.get("/api/admin");
      setAdmins(response.data);
    } catch (error) {
      console.error("Error fetching admins", error);
    } finally {
      setFetchingAdmins(false);
    }
  };

  // UseEffect to fetch users initially
  useEffect(() => {
    fetchAdmins();
  }, []);

  // Function to handle adding a new admin
  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !username || !password || !name) {
      setError("Please provide all required information");

      setLoading(false);
      return;
    }

    if (!nameUsernameRegex.test(username)) {
      setError("Username can only contain letters and spaces");
      setLoading(false);
      return;
    }

    const data = {
      email,
      provider,
      username,
      name,
      password,
    };

    try {
      const response = await axios.post("/api/admin/create", data);
      swal.fire(
        "Admin Added",
        response.data.message || "Admin created successfully!",
        "success"
      );
      fetchAdmins(); // Re-fetch admins list after creation
      handleModalClose();
    } catch (error) {
      setError(
        error.response?.data.message ||
          "Error creating admin. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // for filtering admins based on role and search term
  const filteredAdmins = admins.filter((admin) => {
    const matchesRole = roleFilter === "all" || admin.role === roleFilter;
    const matchesSearchTerm =
      searchTerm.trim() === "" ||
      searchTerm
        .split(" ")
        .every(
          (term) =>
            (admin.name &&
              admin.name.toLowerCase().includes(term.toLowerCase())) ||
            (admin.username &&
              admin.username.toLowerCase().includes(term.toLowerCase()))
        );
    return matchesRole && matchesSearchTerm;
  });

  const handleDeleteAdmin = (id) => {
    // Prevent deleting if already in progress
    if (deletingId) return;

    const adminToDelete = admins.find((admin) => admin._id === id);
    if (!adminToDelete) return;

    setDeletingId(id);

    swal
      .fire({
        title: "Are you sure?",
        text: `Do you want to delete the admin "${adminToDelete.name}"?`,
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes, delete!",
        confirmButtonColor: "#DB4444",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(`/api/admin/${id}`)
            .then(() => {
              setAdmins((prevAdmins) =>
                prevAdmins.filter((admin) => admin._id !== id)
              );
              swal.fire("Deleted!", "Admin has been deleted.", "success");
            })
            .catch((error) => console.error("Error deleting admin:", error))
            .finally(() => setDeletingId(null));
        } else {
          setDeletingId(null);
        }
      });
  };

  const handleModalClose = () => {
    setEmail("");
    setPassword("");
    setName("");
    setUsername("");
    setError("");
    setIsModalOpen(false);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-base sm:text-3xl font-semibold text-gray-800 mb-4 sm:mb-0">
            Admins & Users
          </h1>
          <div className="flex justify-center items-center gap-3">
            <Link
              href={"/admin/vendor-application"}
              className={`bg-blue-600 text-white md:px-6 px-2 py-2 rounded-md shadow-md transition-all text-sm sm:text-base ${
                fetchingAdmins || deletingId
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-700"
              }`}
            >
              Vendors Application
            </Link>
            <button
              disabled={fetchingAdmins || deletingId}
              onClick={() => setIsModalOpen(true)}
              className={`bg-blue-600 text-white md:px-6 px-2 py-2 rounded-md shadow-md transition-all text-sm sm:text-base ${
                fetchingAdmins || deletingId
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-700"
              }`}
            >
              Create Admin
            </button>
          </div>
        </div>

        <div className="w-full mx-auto">
          <div className="flex flex-wrap gap-4 sm:flex-row flex-col">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search admins..."
                className="border px-4 py-2 rounded-lg w-full text-sm sm:text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="border px-4 py-2 rounded-lg w-full text-sm sm:text-base"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>
        </div>

        {fetchingAdmins || deletingId ? (
          <LoadingIndicator />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAdmins.length === 0 ? (
              <p className="text-gray-500 text-center col-span-full">
                No admins or users found.
              </p>
            ) : (
              filteredAdmins.map((admin) => (
                <div
                  key={admin._id}
                  className="bg-white p-5 shadow-lg rounded-lg border border-gray-200 hover:shadow-xl transition-all"
                >
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                    {admin.name}
                  </h3>
                  <p className="text-gray-500 text-sm sm:text-base">
                    {admin.username}
                  </p>
                  <p className="text-gray-500 text-xs sm:text-sm">
                    {admin.email}
                  </p>
                  <p
                    className={`text-sm sm:text-base font-semibold mt-4 ${
                      admin.role === "admin"
                        ? "text-blue-600"
                        : "text-green-600"
                    }`}
                  >
                    {admin.role}
                  </p>
                  <div className="flex gap-5 items-center mt-2">
                    <Link
                      href={`/admin/${admin._id}`}
                      className="text-blue-600 hover:text-blue-800 transition-all"
                    >
                      <button className="bg-aqua-forest-500 hover:bg-green-600 text-white font-medium py-1 px-3 rounded-lg transition">
                        View
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDeleteAdmin(admin._id)}
                      className="btn-red hover:bg-red-600 text-white font-medium py-1 px-3 rounded-lg transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Create Admin
            </h2>
            <form onSubmit={handleAddAdmin}>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border px-4 py-2 rounded-lg"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full border px-4 py-2 rounded-lg"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border px-4 py-2 rounded-lg"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border px-4 py-2 rounded-lg"
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleModalClose}
                  className={`${
                    loading ? "bg-gray-300 cursor-not-allowed" : "bg-gray-400"
                  } text-gray-800 px-4 py-2 rounded-md`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`${
                    loading ? "bg-gray-400" : "bg-blue-600"
                  } text-white px-4 py-2 rounded-md`}
                >
                  {loading ? "Creating..." : "Create Admin"}
                </button>
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default withSwal(AddAdmin);
